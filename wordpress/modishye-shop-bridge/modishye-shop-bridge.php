<?php
/**
 * Plugin Name: Modishye Shop Bridge
 * Description: Turns this WordPress install into a checkout-only shop behind the new Modishye site. Buy links add a guide to the order and land on a clean branded checkout, and once WordPress lives on the shop address every other page forwards to the new site.
 * Version: 1.1.1
 * Author: Dessi
 */

if (!defined('ABSPATH')) {
    exit;
}

// The new site. Override in wp-config.php with define('MODISHYE_SITE_URL', 'https://...') if it ever changes.
if (!defined('MODISHYE_SITE_URL')) {
    define('MODISHYE_SITE_URL', 'https://www.accordingtomodishyeblog.com');
}

/** True once WordPress is being served from the shop address (shop.accordingtomodishyeblog.com). */
function modishye_on_shop_host() {
    $host = isset($_SERVER['HTTP_HOST']) ? strtolower($_SERVER['HTTP_HOST']) : '';
    return strpos($host, 'shop.') === 0;
}

/** Pages a buyer is allowed to see: checkout, cart, thank you page and the downloads account area. */
function modishye_is_shop_page() {
    if (!function_exists('is_checkout')) {
        return false;
    }
    return is_checkout() || is_cart() || is_account_page();
}

/**
 * Where "keep shopping" links go. Until WordPress moves to the shop address the new site is not live on the
 * main domain, so buyers go to the existing WordPress shop page. After the move they go to the new guides page.
 */
function modishye_guides_url() {
    if (!modishye_on_shop_host() && function_exists('wc_get_page_permalink')) {
        return wc_get_page_permalink('shop');
    }
    return rtrim(MODISHYE_SITE_URL, '/') . '/guides';
}

/* 1. A buy link from the new site adds that guide to the order and goes straight to checkout. */

// One copy of each guide. A second click on a guide already in the order changes nothing.
add_filter('woocommerce_add_to_cart_validation', function ($passed, $product_id) {
    if (!isset($_GET['add-to-cart']) || !function_exists('WC') || !WC()->cart) {
        return $passed;
    }
    foreach (WC()->cart->get_cart() as $item) {
        if ((int) $item['product_id'] === (int) $product_id) {
            return false;
        }
    }
    return $passed;
}, 5, 2);

// When nothing was added (the guide was already in the order), still show a clean checkout address,
// so a refresh never repeats the buy link.
add_action('template_redirect', function () {
    if (isset($_GET['add-to-cart']) && function_exists('is_checkout') && is_checkout()) {
        wp_safe_redirect(wc_get_checkout_url());
        exit;
    }
}, 0);

// Skip the cart page.
add_filter('woocommerce_add_to_cart_redirect', function ($url) {
    return isset($_GET['add-to-cart']) ? wc_get_checkout_url() : $url;
}, 99);

// No "added to your cart" banner on the checkout page.
add_filter('wc_add_to_cart_message_html', function ($message) {
    return isset($_GET['add-to-cart']) ? '' : $message;
});

/* 1b. The order summary on checkout works as the cart: remove a guide, or go back for another. */

add_filter('woocommerce_cart_item_name', function ($name, $cart_item, $cart_item_key) {
    if (!function_exists('is_checkout') || !is_checkout() || is_wc_endpoint_url('order-received')) {
        return $name;
    }
    $label = sprintf('Remove %s from your order', wp_strip_all_tags($name));
    return $name . ' <a class="modishye-remove" href="' . esc_url(wc_get_cart_remove_url($cart_item_key)) . '" aria-label="' . esc_attr($label) . '">Remove</a>';
}, 10, 3);

add_action('woocommerce_checkout_order_review', function () {
    echo '<p class="modishye-more"><a href="' . esc_url(modishye_guides_url()) . '">Add another guide</a></p>';
}, 5);

// An emptied order sends the buyer back to the guides, not the old shop.
add_filter('woocommerce_return_to_shop_redirect', 'modishye_guides_url');
add_filter('woocommerce_return_to_shop_text', function () {
    return 'Back to the guides';
});

/* 2. Shop pages use a bare template: no old header, menu, sidebar or footer. */

add_filter('template_include', function ($template) {
    return modishye_is_shop_page() ? __DIR__ . '/shop-template.php' : $template;
}, 999);

add_action('wp_enqueue_scripts', function () {
    if (!modishye_is_shop_page()) {
        return;
    }
    wp_enqueue_style('modishye-shop-fonts', 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,600&family=Instrument+Sans:wght@400;600&display=swap', array(), null);
    wp_enqueue_style('modishye-shop', plugins_url('shop.css', __FILE__), array('modishye-shop-fonts'), '1.1.1');
}, 999);

add_filter('body_class', function ($classes) {
    if (modishye_is_shop_page()) {
        $classes[] = 'modishye-shop';
    }
    return $classes;
});

/* 3. On the shop address, nothing else from the old site is reachable. */

add_action('template_redirect', function () {
    if (!modishye_on_shop_host() || modishye_is_shop_page()) {
        return;
    }
    // File downloads from order emails, payment gateway callbacks and feeds for WooCommerce itself stay reachable.
    if (isset($_GET['download_file']) || isset($_GET['wc-ajax']) || isset($_GET['wc-api']) || is_robots()) {
        return;
    }
    // Same path on the new site. It already knows where every old WordPress address moved to.
    $path = isset($_SERVER['REQUEST_URI']) ? strtok($_SERVER['REQUEST_URI'], '?') : '/';
    wp_redirect(rtrim(MODISHYE_SITE_URL, '/') . $path, 301, 'Modishye Shop Bridge');
    exit;
}, 1);

// Keep the shop address out of Google.
add_action('send_headers', function () {
    if (modishye_on_shop_host()) {
        header('X-Robots-Tag: noindex, nofollow', true);
    }
});
add_filter('wp_robots', function ($robots) {
    if (modishye_on_shop_host() || modishye_is_shop_page()) {
        return array('noindex' => true, 'nofollow' => true);
    }
    return $robots;
});

/* 4. After paying, point the buyer back to the library. */

add_action('woocommerce_thankyou', function () {
    echo '<p class="modishye-back"><a href="' . esc_url(MODISHYE_SITE_URL) . '">Back to the library</a></p>';
}, 99);
