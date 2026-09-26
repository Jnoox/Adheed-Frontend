import { useNavigate } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { Table } from '@/components/ui/Table'
import warningTriangle from '@/assets/warning-triangle.svg'
import type { DashboardCase } from '@/schemas'
import { CaseStatusPill } from './CaseStatusPill'

type CasesTableProps = {
  cases: DashboardCase[]
}

export function CasesTable({ cases }: CasesTableProps) {
  const navigate = useNavigate()
  const { t } = useT()

  return (
    <Table
      striped
      className="overflow-hidden rounded-md border border-border"
      rows={cases}
      getRowKey={(row) => row.id}
      onRowClick={(row) => navigate(`/cases/${row.id}`)}
      columns={[
        {
          key: 'number',
          header: t('dashboard.colNumber'),
          render: (row) => <span className="font-latin">{row.caseNumber}</span>,
        },
        {
          key: 'type',
          header: t('dashboard.colType'),
          render: (row) => row.caseType,
        },
        {
          key: 'status',
          header: t('dashboard.colStatus'),
          render: (row) => <CaseStatusPill status={row.status} />,
        },
        {
          key: 'evidence',
          header: t('dashboard.colEvidence'),
          render: (row) => (
            <span className="font-latin">{row.evidenceCount}</span>
          ),
        },
        {
          key: 'alerts',
          header: t('dashboard.colAlerts'),
          render: (row) =>
            row.alertCount > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-warning-border bg-warning-surface px-3 py-1 text-title text-warning">
                <img
                  src={warningTriangle}
                  alt=""
                  width={21}
                  height={19}
                  className="shrink-0"
                />
                <span className="font-latin">{row.alertCount}</span>
              </span>
            ) : (
              <span className="text-text-muted">—</span>
            ),
        },
      ]}
    />
  )
}
