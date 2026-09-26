import { render } from '@testing-library/react'
import { AlertStrip } from '@/features/dashboard/components/AlertStrip'

describe('AlertStrip', () => {
  it('renders nothing when there are no alerts', () => {
    const { container } = render(<AlertStrip alerts={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
