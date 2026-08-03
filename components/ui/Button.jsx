import Link from "next/link";
import styles from "./Button.module.css";

const VARIANTS = {
  sun: styles.sun,       // primary CTA — gold bg, pine text
  pine: styles.pine,     // secondary — outlined pine, fills on hover
  line: styles.line,     // for photo/dark backgrounds — white outline
  forest: styles.forest, // dark pine fill — used on gold backgrounds
};

/**
 * Usage:
 *   <Button variant="sun" href="/submit">Share your tale</Button>
 *   <Button variant="pine" onClick={handleClick}>Read more</Button>
 */
export default function Button({
  variant = "sun",
  href,
  type = "button",
  onClick,
  disabled = false,
  className = "",
  children,
  ...rest
}) {
  const classes = `${styles.btn} ${VARIANTS[variant] || VARIANTS.sun} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
}
