#!/usr/bin/env node
const { execSync } = require('child_process')
const Octokit = require('@octokit/rest')

const removeUnuseChar = value => {
  return value.replace(/(\r\n\t|\n|\r\t)/gm, '')
}

const getVersionTag = () => {
  const tagName = execSync('git describe --always --tags $(git rev-list --tags --max-count=1)').toString()
  const tagNameArr = removeUnuseChar(tagName).split('_')
  const PACKAGE_NAME_INDEX = 0
  const VERSION_INDEX = 1
  const packageName = tagNameArr[PACKAGE_NAME_INDEX]
  const version = tagNameArr[VERSION_INDEX]
  return {
    packageName,
    version,
  }
}

const getPreviousTag = ({ packageName }) => {
  const tagName = execSync(`git describe --always --tags $(git rev-list --tags) | grep ${packageName}`).toString()
  const tagNameArr = tagName.split('\n')
  const PREVIOUS_TAG_INDEX = 1
  if (tagNameArr[PREVIOUS_TAG_INDEX]) {
    tagNameArr[PREVIOUS_TAG_INDEX]
  }
  return ''
}

const appendCommitInfo = ({ releaseNote, commitLogArr }) => {
  let newReleaseNote = releaseNote
  const COMMIT_INDEX = 0
  const COMMIT_AUTHOR_INDEX = 1
  releaseNote = releaseNote.concat(`
- ${commitLogArr[COMMIT_INDEX]} | ${
    commitLogArr[COMMIT_AUTHOR_INDEX]
      ? commitLogArr[COMMIT_AUTHOR_INDEX].replace('Author: ', '')
      : commitLogArr[COMMIT_AUTHOR_INDEX]
  } | `)
  return newReleaseNote
}

const appendCommitMessage = ({ releaseNote, commitLogArr }) => {
  let newReleaseNote = releaseNote
  for (let i = 4; i < commitLogArr.length; i++) {
    newReleaseNote = releaseNote.concat(
      `${commitLogArr[i] ? commitLogArr[i].replace('\n').replace(/\s{2,}/g, '') : ''}`,
    )
  }
  return newReleaseNote
}

const formatReleaseNote = ({ previousTag, packageName, version, commitLog }) => {
  let releaseNote = `
Release: ${packageName}_${version}
Rollback: ${previousTag}
Changes:
commit | author |description
  `
  const footer = `

approver: @willmcvay
monitor: https://sentry.io/organizations/reapit-ltd/projects/`
  if (!commitLog) {
    return releaseNote.concat(footer)
  }
  const commitArr = commitLog.split('commit ')
  commitArr.forEach(item => {
    const commitLogArr = item.split('\n')
    if (commitLogArr.length > 1) {
      releaseNote = appendCommitInfo({ releaseNote, commitLogArr })
      releaseNote = appendCommitMessage({ releaseNote, commitLogArr })
    }
  })
  releaseNote = releaseNote.concat(footer)
  return releaseNote
}

const editReleaseNote = async ({ packageName, version, previousTag }) => {
  try {
    const commitLog = execSync(`git log ${packageName}_${version}...${previousTag}`).toString()
    const token = process.env.GITHUB_TOKEN
    const octokit = new Octokit({ auth: token })
    const latestRelease = await octokit.repos.getReleaseByTag({
      owner: 'reapit',
      repo: 'foundations',
      tag: `${packageName}_${version}`,
    })
    if (latestRelease && latestRelease.data) {
      const bodyRelease = formatReleaseNote({ previousTag, version, packageName, commitLog })
      await octokit.repos.updateRelease({
        owner: 'reapit',
        repo: 'foundations',
        body: bodyRelease,
        name: `${latestRelease.data.name}_released`,
        release_id: latestRelease.data.id,
      })
    }
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  removeUnuseChar,
  getVersionTag,
  getPreviousTag,
  formatReleaseNote,
  editReleaseNote,
}