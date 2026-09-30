import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import { FilterGroup, FilterPill } from '@/components/ui/FilterPill'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { Table } from '@/components/ui/Table'
import { TextField } from '@/components/ui/TextField'
import { AddEvidenceModal } from '@/components/evidence/AddEvidenceModal'
import {
  evidenceShortKey,
  evidenceTypeKey,
  evidenceTypeValues,
} from '@/components/evidence/type-options'
import { EvidenceStatusPill } from '@/features/evidence/components/EvidenceStatusPill'
import {
  countEvidenceFilters,
  evidenceFilterIds,
  evidenceFilterKey,
  evidenceMatchesFilter,
  evidenceMatchesQuery,
  sortEvidence,
  type EvidenceFilterId,
  type EvidenceLabelSet,
  type EvidenceSort,
} from '@/features/evidence/evidence-list'
import {
  useEvidence,
  useEvidenceCase,
} from '@/features/evidence/hooks/useEvidence'
export default function EvidenceListPage() {
  const { caseId = '' } = useParams()
  const navigate = useNavigate()
  const evidenceQuery = useEvidence(caseId)
  const caseQuery = useEvidenceCase(caseId)
  const [filter, setFilter] = useState<EvidenceFilterId>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<EvidenceSort>('date')
  const [adding, setAdding] = useState(false)
  const { t, language } = useT()
  const short = Object.fromEntries(
    evidenceTypeValues.map((type) => [type, t(evidenceShortKey[type])]),
  ) as EvidenceLabelSet
  const option = Object.fromEntries(
    evidenceTypeValues.map((type) => [type, t(evidenceTypeKey[type])]),
  ) as EvidenceLabelSet

  const items = evidenceQuery.data ?? []
  const counts = countEvidenceFilters(items)
  const visible = useMemo(() => {
    const source = evidenceQuery.data ?? []
    return sortEvidence(
      source.filter(
        (item) =>
          evidenceMatchesFilter(item.type, filter) &&
          evidenceMatchesQuery(item, query, { short, option }),
      ),
      sort,
      short,
      language,
    )
  }, [evidenceQuery.data, filter, query, sort, short, option, language])

  if (evidenceQuery.isPending || caseQuery.isPending) {
    return <Spinner />
  }

  if (evidenceQuery.isError || caseQuery.isError) {
    return (
      <ErrorState
        message={t('evidence.loadError')}
        onRetry={() => {
          void evidenceQuery.refetch()
          void caseQuery.refetch()
        }}
      />
    )
  }

  const caseNumber = caseQuery.data.caseNumber

  return (
    <div className="flex flex-col gap-section">
      <header className="flex flex-wrap items-center justify-between gap-inline">
        <h1 className="text-title text-text">
          {t('evidence.listTitle', { caseNumber })}
        </h1>
        <Button onClick={() => setAdding(true)}>{t('evidence.addNew')}</Button>
      </header>
      <FilterGroup label={t('evidence.filterGroup')}>
        {evidenceFilterIds.map((id) => (
          <FilterPill key={id} pressed={id === filter} onClick={() => setFilter(id)}>
            {t(evidenceFilterKey[id])} <span className="font-latin">({counts[id]})</span>
          </FilterPill>
        ))}
      </FilterGroup>
      <div className="grid grid-cols-2 gap-inline">
        <TextField
          name="evidence-search"
          label={t('evidence.search')}
          value={query}
          placeholder={t('evidence.searchPlaceholder')}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          name="evidence-sort"
          label={t('evidence.sort')}
          value={sort}
          options={[
            { value: 'date', label: t('evidence.sortDate') },
            { value: 'type', label: t('evidence.sortType') },
          ]}
          onChange={(event) => setSort(event.target.value as EvidenceSort)}
        />
      </div>
      {visible.length === 0 ? (
        <EmptyState title={t('evidence.empty')} />
      ) : (
        <Table
          striped
          className="overflow-hidden rounded-md border border-border"
          rows={visible}
          getRowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/cases/${caseId}/evidence/${row.id}`)}
          columns={[
            {
              key: 'name',
              header: t('evidence.colName'),
              render: (row) => row.name,
            },
            {
              key: 'case',
              header: t('evidence.colCase'),
              render: () => <span className="font-latin">{caseNumber}</span>,
            },
            {
              key: 'type',
              header: t('evidence.colType'),
              render: (row) => (
                <span className="inline-flex rounded-full border border-border bg-surface-tint px-3 py-1 text-caption text-text">
                  {option[row.type]}
                </span>
              ),
            },
            {
              key: 'status',
              header: t('evidence.colStatus'),
              render: (row) => <EvidenceStatusPill status={row.status} />,
            },
          ]}
        />
      )}
      <AddEvidenceModal
        caseId={caseId}
        open={adding}
        onClose={() => setAdding(false)}
      />
    </div>
  )
}
