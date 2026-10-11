import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductBugStatus from '../../client/components/ProductBugStatus.vue'

describe('ProductBugStatus', () => {
  it.each(['PASS', 'SKIP', 'FAIL', 'ERROR'])('shows a neutral dash for %s without a recorded product bug', (verdict) => {
    const wrapper = mount(ProductBugStatus, { props: { verdict, findings: [] } })
    const indicator = wrapper.get('[role="img"]')

    expect(wrapper.text()).toBe('—')
    expect(indicator.attributes('aria-label')).toBe('No product bug recorded.')
    expect(indicator.attributes('tabindex')).toBe('0')
    expect(indicator.attributes('title')).toBe(['FAIL', 'ERROR'].includes(verdict)
      ? 'The test failed or was terminated due to a problem in the test execution environment. No product bug was observed.'
      : 'No product bug recorded.')
    wrapper.unmount()
  })

  it.each([
    ['FILED', 'New product bug opened.'],
    ['EXISTING', 'Pre-existing product bug detected.'],
  ])('keeps the Jira link and explanation for a %s product bug', (action, description) => {
    const wrapper = mount(ProductBugStatus, { props: {
      verdict: 'FAIL', findings: [{
        id: 'bug-1', category: 'PRODUCT_BUG', action, bug_key: 'RHOAIENG-123',
        jira_url: 'https://redhat.atlassian.net/browse/RHOAIENG-123',
      }],
    } })

    const link = wrapper.get('a')
    expect(link.text()).toBe('RHOAIENG-123')
    expect(link.attributes('href')).toBe('https://redhat.atlassian.net/browse/RHOAIENG-123')
    expect(wrapper.text()).toContain(description)
    expect(wrapper.find('[role="img"]').exists()).toBe(false)
    wrapper.unmount()
  })
})
