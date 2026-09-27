import { useNavigate } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { Table } from '@/components/ui/Table'
import { CaseStatusPill } from '@/features/dashboard/components/CaseStatusPill'
import { useCases } from '../hooks/useCases'

export default function CasesListPage() {
  const navigate = useNavigate()
  const cases = useCases()
  const { t } = useT()

  if (cases.isPending) {
    return <Spinner />
  }

  if (cases.isError) {
    return (
      <ErrorState
        message={t('dashboard.loadError')}
        onRetry={() => void cases.refetch()}
      />
    )
  }

  return (
    <div className="flex flex-col gap-section">
      <div className="flex flex-wrap items-center justify-between gap-inline">
        <h1 className="text-body">{t('cases.listTitle')}</h1>
        <Button onClick={() => navigate('/cases/new')}>
          {t('dashboard.createCase')}
        </Button>
      </div>

      <Table
        striped
        className="overflow-hidden rounded-md border border-border"
        rows={cases.data}
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
            key: 'location',
            header: 'Location',
            render: (row) => row.location,
          },
        ]}
      />
    </div>
  )
}
