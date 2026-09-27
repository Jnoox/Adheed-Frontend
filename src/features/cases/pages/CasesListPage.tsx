import { useNavigate } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import { CaseStatusPill } from '@/components/ui/CaseStatusPill'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { Table } from '@/components/ui/Table'
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
        message={t('cases.loadError')}
        onRetry={() => void cases.refetch()}
      />
    )
  }

  return (
    <div className="flex flex-col gap-section">
      <div className="flex flex-wrap items-center justify-between gap-inline">
        <h1 className="text-title text-text">{t('cases.listTitle')}</h1>
        <Button onClick={() => navigate('/cases/new')}>{t('cases.create')}</Button>
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
            header: t('cases.colNumber'),
            render: (row) => <span className="font-latin">{row.caseNumber}</span>,
          },
          {
            key: 'type',
            header: t('cases.colType'),
            render: (row) => row.caseType,
          },
          {
            key: 'status',
            header: t('cases.colStatus'),
            render: (row) => <CaseStatusPill status={row.status} />,
          },
          {
            key: 'location',
            header: t('cases.colLocation'),
            render: (row) => row.location,
          },
        ]}
      />
    </div>
  )
}
