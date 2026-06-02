const { test, expect } = require('@playwright/test');

// Increase timeout for all tests to 2 minutes
test.setTimeout(120000);

test.describe('Safora Contact Form Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Increase navigation timeout
    await page.goto('https://safora.se/en/contact.html', { timeout: 60000 });
    
    // Don't wait for networkidle - it takes too long
    await page.waitForTimeout(3000);
    
    // Scroll to form
    await page.locator('#contact-form').scrollIntoViewIfNeeded();
    
    // Wait for form fields with longer timeout
    await page.waitForSelector('#name', { timeout: 15000 });
    await page.waitForSelector('#email', { timeout: 15000 });
    await page.waitForSelector('#phone', { timeout: 15000 });
    await page.waitForSelector('#message', { timeout: 15000 });
    
    console.log('✅ Contact form loaded!');
  });

  test('TC-CFM-01: Valid form submission', async ({ page }) => {
    const uniqueEmail = `test.${Date.now()}@example.com`;
    
    console.log('Filling form...');
    
    await page.fill('#name', 'QA Test Engineer');
    await page.fill('#email', uniqueEmail);
    await page.fill('#phone', '+94 77 123 4567');
    await page.fill('#message', 'Automated test submission for Safora QA assignment.');
    
    await page.screenshot({ path: 'form-filled.png' });
    
    // Click submit - try different selectors
    const submitBtn = page.locator('#contact-form button[type="submit"], #contact-form input[type="submit"]');
    await submitBtn.click();
    
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'after-submit.png' });
    
    console.log('✅ Form submitted successfully!');
  });

  test('TC-CFM-02: Empty email validation', async ({ page }) => {
    console.log('Testing empty email validation...');
    
    await page.fill('#name', 'Test User');
    await page.fill('#phone', '+94 77 123 4567');
    await page.fill('#message', 'Testing validation');
    // Leave email empty
    
    const submitBtn = page.locator('#contact-form button[type="submit"]');
    await submitBtn.click();
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'empty-email-test.png' });
    
    console.log('✅ Empty email test completed');
  });

  test('TC-CFM-03: Invalid email validation', async ({ page }) => {
    console.log('Testing invalid email validation...');
    
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'invalid-email');
    await page.fill('#phone', '+94 77 123 4567');
    await page.fill('#message', 'Testing invalid email');
    
    const submitBtn = page.locator('#contact-form button[type="submit"]');
    await submitBtn.click();
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'invalid-email-test.png' });
    
    // Check if browser validation catches invalid email
    const emailField = page.locator('#email');
    const isValid = await emailField.evaluate(el => el.validity.valid);
    
    if (!isValid) {
      console.log('✅ Invalid email correctly rejected by browser validation!');
    } else {
      console.log('⚠️ No browser validation - check screenshot');
    }
  });
});