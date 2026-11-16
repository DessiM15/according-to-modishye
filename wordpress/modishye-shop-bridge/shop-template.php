<?php
/**
 * Bare page used for checkout, cart, thank you and account pages.
 * Only the Modishye wordmark, the page content and a short footer.
 */
if (!defined('ABSPATH')) {
    exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php if (function_exists('wp_body_open')) { wp_body_open(); } ?>
<a class="modishye-skip" href="#modishye-main">Skip to checkout</a>
<header class="modishye-bar">
  <a class="modishye-wordmark" href="<?php echo esc_url(MODISHYE_SITE_URL); ?>">Modishye</a>
  <a class="modishye-return" href="<?php echo esc_url(modishye_guides_url()); ?>">Back to the guides</a>
</header>
<main id="modishye-main" class="modishye-main">
  <?php while (have_posts()) : the_post(); ?>
    <h1 class="modishye-title"><?php the_title(); ?></h1>
    <div class="modishye-content"><?php the_content(); ?></div>
  <?php endwhile; ?>
</main>
<footer class="modishye-foot">
  <p>Secure checkout for According to Modishye. Your guide arrives by email as a PDF as soon as the order goes through.</p>
  <p><a href="<?php echo esc_url(rtrim(MODISHYE_SITE_URL, '/') . '/contact'); ?>">Need help with an order?</a></p>
</footer>
<?php wp_footer(); ?>
</body>
</html>
