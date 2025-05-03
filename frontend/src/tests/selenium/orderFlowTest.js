const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

async function handleAlert(driver, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
      console.log(` Alert appeared: ${alertText}`);
      await alert.accept();
      console.log(' Alert accepted.');
      return alertText;
    } catch (err) {
      if (i < retries - 1) {
        console.log(`ℹ No alert found, retrying after ${delay}ms...`);
        await driver.sleep(delay);
      }
    }
  }
  console.log('ℹ No alert found after retries.');
  return null;
}

async function orderFlowTest() {
  const options = new chrome.Options();
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--remote-allow-origins=*');

  let driver;
  try {
    console.log('🚀 Initializing Chrome WebDriver...');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    console.log(' Chrome WebDriver initialized successfully.');

    // 0.  LOGIN
    console.log('🌐 Navigating to Login Page...');
    await driver.get('http://localhost:3000/LoginPage');
    console.log(' Opened Login Page');

    await driver.wait(until.elementLocated(By.name('email')), 5000);
    const emailField = await driver.findElement(By.name('email'));
    const passwordField = await driver.findElement(By.name('password'));
    const loginButton = await driver.findElement(By.xpath("//button[contains(text(),'Login')]"));

    await emailField.sendKeys('testuser1@example.com');
    await passwordField.sendKeys('Tnj12345@#$');
    await loginButton.click();
    console.log(' Submitted Login Form');

    await driver.sleep(5000);
    const alertText = await handleAlert(driver);
    if (alertText && alertText.includes('Invalid')) {
      console.error(' Login failed with alert:', alertText);
      throw new Error('Invalid credentials');
    }

    const currentUrlAfterLogin = await driver.getCurrentUrl();
    if (currentUrlAfterLogin.includes('/LoginPage')) {
      console.error(' Login redirect failed: Still on LoginPage.');
      const errorMessage = await driver
        .findElement(By.xpath("//*[contains(text(),'Invalid')]"))
        .catch(() => null);
      if (errorMessage) {
        console.error(' Error message on LoginPage:', await errorMessage.getText());
      }
      const token = await driver.executeScript('return localStorage.getItem("token");');
      if (token) {
        console.log(' Token found despite no redirect:', token.slice(0, 20) + '...');
        console.log(' Manually navigating to Order Page...');
        await driver.get('http://localhost:3000/order');
      } else {
        console.error(' No token found in localStorage.');
        throw new Error('Login failed: No redirect and no token');
      }
    } else {
      console.log(' Login successful, redirected to:', currentUrlAfterLogin);
    }

    // 1.  Open Order Page
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.includes('/order')) {
      console.log('🌐 Navigating to Order Page...');
      await driver.get('http://localhost:3000/order');
    }
    console.log(' Opened Order Page');

    await driver.wait(until.elementLocated(By.className('menu-item')), 5000).catch(() => {
      console.error('⚠️ No menu items found on Order Page.');
    });

    // 2.  Add to Favorites
    const favoriteButtons = await driver.findElements(By.xpath("//button[contains(text(),'Add to Favorites')]"));
    if (favoriteButtons.length > 0) {
      await favoriteButtons[0].click();
      console.log(' Clicked Add to Favorites ❤️');
      await driver.sleep(1000); // Ensure alert appears
      const alertText1 = await handleAlert(driver);
      if (alertText1 && alertText1.includes('added to favorites')) {
        console.log(' Favorite added successfully.');
      } else {
        console.error('❌ Unexpected alert for Favorites:', alertText1);
      }
    } else {
      console.log(' No Favorites button found.');
    }

    // 3.  Add to Basket
    const basketButtons = await driver.findElements(By.xpath("//button[contains(text(),'Add to Basket')]"));
    if (basketButtons.length > 0) {
      await basketButtons[0].click();
      console.log(' Clicked Add to Basket 🧺');
      await driver.sleep(1000);
      const alertText2 = await handleAlert(driver);
      if (alertText2 && alertText2.includes('added to basket')) {
        console.log(' Basket item added successfully.');
      } else {
        console.error(' Unexpected alert for Basket:', alertText2);
      }
    } else {
      console.log(' No Basket button found.');
    }

    // 4.  Add to Cart from Order Page
    const addToCartButtons = await driver.findElements(By.xpath("//button[contains(text(),'Add to Cart')]"));
    if (addToCartButtons.length > 0) {
      await addToCartButtons[0].click();
      console.log(' Added item to Cart from Order Page 🛒');
      await driver.sleep(1000);
      const alertTextCart = await handleAlert(driver);
      if (alertTextCart && alertTextCart.includes('added to cart')) {
        console.log(' Cart item added successfully from Order Page.');
      }
      await driver.wait(until.urlContains('/cart'), 5000);
      const currentUrlAfterCart = await driver.getCurrentUrl();
      if (currentUrlAfterCart.includes('/cart')) {
        console.log(' Successfully navigated to Cart Page after adding item from Order Page!');
      } else {
        console.error(' Failed to navigate to Cart Page after adding item from Order Page.');
      }
    } else {
      console.log(' No Add to Cart button found on Order Page.');
    }

    // 5. ✅ Navigate to Favorites Page and Add to Cart
    console.log('🌐 Navigating to Favorites Page...');
    await driver.get('http://localhost:3000/favorites');
    console.log('✅ Opened Favorites Page');

    await driver.wait(until.elementLocated(By.className('favorite-item')), 5000).catch(async () => {
      console.error('⚠️ No favorite items found.');
      await handleAlert(driver);
    });

    const favoriteCartButtons = await driver.findElements(By.xpath("//button[contains(text(),'Add to Cart')]"));
    if (favoriteCartButtons.length > 0) {
      await favoriteCartButtons[0].click();
      console.log(' Clicked Add to Cart from Favorites Page 🛒');
      await driver.sleep(1000);
      const alertText3 = await handleAlert(driver);
      if (alertText3 && alertText3.includes('added to cart')) {
        console.log(' Cart item added from Favorites successfully.');
      } else {
        console.error(' Unexpected alert for Favorites Cart:', alertText3);
      }
      await driver.wait(until.urlContains('/cart'), 5000);
      const currentUrlAfterFavoritesCart = await driver.getCurrentUrl();
      if (currentUrlAfterFavoritesCart.includes('/cart')) {
        console.log(' Successfully navigated to Cart Page after adding item from Favorites Page!');
      } else {
        console.error(' Failed to navigate to Cart Page after adding item from Favorites Page.');
      }
    } else {
      console.log('⚠️ No Add to Cart button found on Favorites Page.');
    }

    // 6.  Navigate to Basket Page and Add to Cart
    console.log(' Navigating to Basket Page...');
    await driver.get('http://localhost:3000/basket');
    console.log(' Opened Basket Page');

    await driver.wait(until.elementLocated(By.className('basket-item')), 5000).catch(async () => {
      console.error(' No basket items found.');
      await handleAlert(driver);
    });

    const basketCartButtons = await driver.findElements(By.xpath("//button[contains(text(),'Add to Cart')]"));
    if (basketCartButtons.length > 0) {
      await basketCartButtons[0].click();
      console.log('✅ Clicked Add to Cart from Basket Page 🛒');
      await driver.sleep(1000);
      const alertText4 = await handleAlert(driver);
      if (alertText4 && alertText4.includes('added to cart')) {
        console.log('✅ Cart item added from Basket successfully.');
      } else {
        console.error('❌ Unexpected alert for Basket Cart:', alertText4);
      }
      await driver.wait(until.urlContains('/cart'), 5000);
      const currentUrlAfterBasketCart = await driver.getCurrentUrl();
      if (currentUrlAfterBasketCart.includes('/cart')) {
        console.log('✅ Successfully navigated to Cart Page after adding item from Basket Page!');
      } else {
        console.error('❌ Failed to navigate to Cart Page after adding item from Basket Page.');
      }
    } else {
      console.log('⚠️ No Add to Cart button found on Basket Page.');
    }

    // 7. ✅ Verify Cart Items
    console.log('🔍 Verifying cart items on Cart Page...');
    const cartItems = await driver.findElements(By.className('cart-item'));
    if (cartItems.length === 0) {
      console.error('❌ No items in cart. Cannot proceed to payment.');
      throw new Error('Empty cart');
    }
    console.log(`ℹ️ Found ${cartItems.length} items in cart.`);

    // 8. ✅ Select Payment on Cart Page
    console.log('🔍 Selecting payment method on Cart Page...');
    await driver.wait(until.elementLocated(By.xpath("//select")), 5000);
    const paymentDropdown = await driver.findElement(By.xpath("//select"));
    await paymentDropdown.click();
    const cashOption = await driver.findElement(By.xpath("//option[@value='Cash']"));
    await cashOption.click();
    console.log('✅ Selected Cash payment method');

    // 9. ✅ Place Order on Cart Page
    console.log('📦 Placing order...');
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Place Order')]")), 5000);
    const placeOrderButton = await driver.findElement(By.xpath("//button[contains(text(),'Place Order')]"));
    await placeOrderButton.click();
    console.log('✅ Clicked Place Order button');
    await driver.sleep(1000);
    const orderAlertText = await handleAlert(driver);
    if (orderAlertText && orderAlertText.includes('Order placed successfully')) {
      console.log('✅ Order placed successfully!');
    } else {
      console.error('❌ Unexpected alert or no alert for order placement:', orderAlertText);
    }

    // 10. ✅ Fetch orderId and Verify Order Status
    console.log('🔑 Fetching orderId from localStorage...');
    const orderId = await driver.executeScript(`
      const token = localStorage.getItem('token');
      if (!token) return null;
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      return localStorage.getItem('lastOrderId_' + userId);
    `);
    console.log('🛒 Fetched Order ID from localStorage:', orderId);

    if (orderId) {
      console.log('🌐 Navigating to Order Status Page...');
      await driver.get(`http://localhost:3000/order-status/${orderId}`);
      console.log('✅ Navigated to Order Status Page with orderId');

      await driver.wait(until.urlContains(`/order-status/${orderId}`), 5000);
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes(`/order-status/${orderId}`)) {
        console.log('✅ Successfully on Order Status Page!');
        const confirmationText = await driver
          .findElement(By.xpath("//*[contains(text(),'Order placed successfully')]"))
          .catch(() => null);
        if (confirmationText) {
          console.log('✅ Order confirmation text found on Order Status Page.');
        } else {
          console.log('⚠️ No order confirmation text found on Order Status Page.');
        }
      } else {
        console.error('❌ URL not correct after navigating to order status.');
      }
    } else {
      console.error('❌ No orderId found! Cannot open Order Status page.');
    }

    // 11. ✅ Stay open for manual inspection
    console.log('⏳ Keeping browser open for inspection...');
    await driver.sleep(10000);

    /*
     * Alternative Scenario: Card Payment
     * Replace steps 8-9 with:
     *
     * // 8. ✅ Select Card Payment on Cart Page
     * console.log('🔍 Selecting payment method on Cart Page...');
     * await driver.wait(until.elementLocated(By.xpath("//select")), 5000);
     * const paymentDropdown = await driver.findElement(By.xpath("//select"));
     * await paymentDropdown.click();
     * const cardOption = await driver.findElement(By.xpath("//option[@value='Card']"));
     * await cardOption.click();
     * console.log('✅ Selected Card payment method');
     *
     * // 9. ✅ Proceed to Payment Page
     * console.log('📦 Proceeding to Payment Page...');
     * await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Proceed to Payment')]")), 5000);
     * const proceedToPaymentButton = await driver.findElement(By.xpath("//button[contains(text(),'Proceed to Payment')]"));
     * await proceedToPaymentButton.click();
     * console.log('✅ Clicked Proceed to Payment button');
     *
     * await driver.wait(until.urlContains('/payment'), 5000);
     * const currentUrlAfterPayment = await driver.getCurrentUrl();
     * if (currentUrlAfterPayment.includes('/payment')) {
     *   console.log('✅ Successfully navigated to Payment Page!');
     * } else {
     *   console.error('❌ Failed to navigate to Payment Page.');
     * }
     *
     * // 10. ✅ Fill Card Details on Payment Page
     * await driver.wait(until.elementLocated(By.name('cardName')), 5000);
     * const cardNameField = await driver.findElement(By.name('cardName'));
     * const cardNumberField = await driver.findElement(By.name('cardNumber'));
     * const expiryField = await driver.findElement(By.name('expiry'));
     * const cvvField = await driver.findElement(By.name('cvv'));
     *
     * await cardNameField.sendKeys('Test User');
     * await cardNumberField.sendKeys('4242 4242 4242 4242');
     * await expiryField.sendKeys('2026-12');
     * await cvvField.sendKeys('123');
     * console.log('✅ Filled card details');
     *
     * // 11. ✅ Place Order on Payment Page
     * console.log('📦 Placing order...');
     * await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Place Order')]")), 5000);
     * const placeOrderButton = await driver.findElement(By.xpath("//button[contains(text(),'Place Order')]"));
     * await placeOrderButton.click();
     * console.log('✅ Clicked Place Order button on Payment Page');
     * await driver.sleep(1000);
     * const orderAlertText = await handleAlert(driver);
     * if (orderAlertText && orderAlertText.includes('Order placed successfully')) {
     *   console.log('✅ Order placed successfully with Card!');
     * } else {
     *   console.error('❌ Unexpected alert or no alert for order placement:', orderAlertText);
     * }
     *
     * Then continue with steps 10-11.
     */

  } catch (err) {
    console.error('❌ Full Order Flow + Status Test Failed:', err);
  } finally {
    if (driver) {
      console.log('🛑 Closing browser...');
      await driver.quit();
    }
  }
}

orderFlowTest();
