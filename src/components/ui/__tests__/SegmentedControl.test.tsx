import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { CaseStatus } from '@/schemas'

const options: Array<{ value: CaseStatus; label: string }> = [
  { value: 'active', label: 'نشطة' },
  { value: 'suspended', label: 'معلقة' },
  { value: 'closed', label: 'مغلقة' },
]

describe('status segmented control', () => {
  it('reports the selected value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <SegmentedControl
        name="status"
        label="حالة القضية"
        value="active"
        options={options}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('radio', { name: 'معلقة' }))
    expect(onChange).toHaveBeenCalledWith('suspended')

    await user.click(screen.getByRole('radio', { name: 'مغلقة' }))
    expect(onChange).toHaveBeenCalledWith('closed')
  })
})
