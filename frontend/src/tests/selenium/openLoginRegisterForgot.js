const { Builder } = require('selenium-webdriver');
require('chromedriver');

async function openLoginRegisterForgot() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // 1. Open LoginPage
    await driver.get('http://localhost:3000/LoginPage');
    console.log('✅ Opened Login Page');
    await driver.sleep(5000); // Wait 5 seconds

    // 2. Open RegisterPage
    await driver.get('http://localhost:3000/RegisterPage');
    console.log('✅ Opened Register Page');
    await driver.sleep(5000); // Wait 5 seconds

    // 3. Open ForgotPasswordPage
    await driver.get('http://localhost:3000/ForgotPasswordPage'); // Adjust URL if different
    console.log('✅ Opened Forgot Password Page');
    await driver.sleep(5000); // Wait 5 seconds

    // 4. Stay open for manual inspection
    console.log('✅ Keeping browser open for you to inspect...');
    await driver.sleep(10000000); // Long wait (like 2-3 hours)
  } catch (err) {
    console.error('❌ Failed:', err);
  }
}

openLoginRegisterForgot();
