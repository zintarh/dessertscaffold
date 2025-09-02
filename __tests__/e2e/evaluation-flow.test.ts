import { test, expect } from '@playwright/test';

describe('Research Topic Evaluation E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/research-evaluation');
  });

  test('should complete full evaluation flow', async ({ page }) => {
    // Fill in the research topic
    await page.fill('[data-testid="topic-input"]', 'Machine learning in agriculture');
    
    // Add keywords
    await page.fill('[data-testid="keyword-input"]', 'crop yield prediction');
    await page.click('[data-testid="add-keyword-btn"]');
    
    await page.fill('[data-testid="keyword-input"]', 'precision farming');
    await page.click('[data-testid="add-keyword-btn"]');
    
    // Verify keywords were added
    await expect(page.locator('[data-testid="keyword-badge"]')).toHaveCount(2);
    
    // Mock the API response
    await page.route('/api/evaluate-topic', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          topic: 'Machine learning in agriculture',
          raw_data: {
            openAlex: { results: [] },
            semanticScholar: { data: [] },
            core: { data: [] },
            crossref: { message: { items: [] } },
            nih: { results: [] },
            cordis: { results: [] },
            grants: { opportunitySynopsisDetail_1_0: [] },
          },
          evaluation: {
            novelty: { score: 8, justification: 'High novelty in agricultural AI applications' },
            trends: { score: 7, justification: 'Growing trend in precision agriculture' },
            methodological_complexity: { score: 6, justification: 'Moderate complexity with ML techniques' },
            research_gaps: { score: 5, justification: 'Some gaps in real-world implementation' },
            grant_potential: { score: 8, justification: 'Strong funding opportunities available' },
            literature_availability: { score: 7, justification: 'Good literature base available' },
            overall_summary: 'Machine learning in agriculture represents a promising research area with high novelty and strong funding potential.',
          },
          report: {
            htmlUrl: '/reports/test.html',
            pdfUrl: '/reports/test.pdf',
          },
        }),
      });
    });
    
    // Submit the form
    await page.click('[data-testid="evaluate-btn"]');
    
    // Wait for loading state
    await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();
    
    // Wait for results
    await expect(page.locator('[data-testid="results-container"]')).toBeVisible({ timeout: 10000 });
    
    // Verify results are displayed
    await expect(page.locator('[data-testid="metric-novelty"]')).toContainText('8/10');
    await expect(page.locator('[data-testid="metric-trends"]')).toContainText('7/10');
    
    // Verify summary is shown
    await expect(page.locator('[data-testid="executive-summary"]')).toContainText('promising research area');
    
    // Verify report links are present
    await expect(page.locator('[data-testid="html-report-link"]')).toBeVisible();
    await expect(page.locator('[data-testid="pdf-report-link"]')).toBeVisible();
  });

  test('should handle validation errors', async ({ page }) => {
    // Try to submit with empty topic
    await page.click('[data-testid="evaluate-btn"]');
    
    // Should show validation error
    await expect(page.locator('[data-testid="topic-error"]')).toBeVisible();
    
    // Fill topic that's too short
    await page.fill('[data-testid="topic-input"]', 'AI');
    await expect(page.locator('[data-testid="topic-error"]')).toContainText('at least 3 characters');
    
    // Fill valid topic
    await page.fill('[data-testid="topic-input"]', 'Machine learning applications');
    await expect(page.locator('[data-testid="topic-error"]')).not.toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.fill('[data-testid="topic-input"]', 'Machine learning in agriculture');
    
    // Mock API error
    await page.route('/api/evaluate-topic', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal server error',
          details: 'An unexpected error occurred',
        }),
      });
    });
    
    await page.click('[data-testid="evaluate-btn"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('unexpected error occurred');
  });

  test('should allow keyword management', async ({ page }) => {
    // Add a keyword
    await page.fill('[data-testid="keyword-input"]', 'test keyword');
    await page.click('[data-testid="add-keyword-btn"]');
    
    await expect(page.locator('[data-testid="keyword-badge"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="keyword-badge"]')).toContainText('test keyword');
    
    // Remove the keyword
    await page.click('[data-testid="remove-keyword-0"]');
    await expect(page.locator('[data-testid="keyword-badge"]')).toHaveCount(0);
    
    // Test keyword limits
    for (let i = 0; i < 11; i++) {
      await page.fill('[data-testid="keyword-input"]', `keyword${i}`);
      await page.click('[data-testid="add-keyword-btn"]');
    }
    
    // Should only have 10 keywords
    await expect(page.locator('[data-testid="keyword-badge"]')).toHaveCount(10);
    
    // Add button should be disabled
    await expect(page.locator('[data-testid="add-keyword-btn"]')).toBeDisabled();
  });

  test('should reset form correctly', async ({ page }) => {
    // Fill form
    await page.fill('[data-testid="topic-input"]', 'Machine learning in agriculture');
    await page.fill('[data-testid="keyword-input"]', 'test keyword');
    await page.click('[data-testid="add-keyword-btn"]');
    
    // Reset form
    await page.click('[data-testid="reset-btn"]');
    
    // Verify form is cleared
    await expect(page.locator('[data-testid="topic-input"]')).toHaveValue('');
    await expect(page.locator('[data-testid="keyword-badge"]')).toHaveCount(0);
  });

  test('should persist data in localStorage', async ({ page }) => {
    // Fill form
    await page.fill('[data-testid="topic-input"]', 'Machine learning in agriculture');
    await page.fill('[data-testid="keyword-input"]', 'test keyword');
    await page.click('[data-testid="add-keyword-btn"]');
    
    // Reload page
    await page.reload();
    
    // Data should be restored
    await expect(page.locator('[data-testid="topic-input"]')).toHaveValue('Machine learning in agriculture');
    await expect(page.locator('[data-testid="keyword-badge"]')).toHaveCount(1);
  });
});
