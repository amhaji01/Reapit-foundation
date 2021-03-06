import * as React from 'react'
import CostCalculator from './cost-calculator'
import TransactionHistory from './transaction-history'
import { Grid, GridItem } from '@reapit/elements'
import ErrorBoundary from '@/components/hocs/error-boundary'
import ServiceChart from './service-chart'
import CostExplorer from './cost-explorer-component'

export type CostExplorerTabProps = {}

export const CostExplorerTab: React.FC<CostExplorerTabProps> = () => {
  return (
    <ErrorBoundary>
      <Grid isMultiLine>
        <GridItem className="is-half">
          <ServiceChart />
        </GridItem>
        <GridItem className="is-half">
          <TransactionHistory />
        </GridItem>
      </Grid>
      <Grid>
        <GridItem>
          <CostExplorer />
        </GridItem>
      </Grid>
      <CostCalculator />
    </ErrorBoundary>
  )
}

export default CostExplorerTab
