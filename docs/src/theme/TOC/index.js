import React, { useEffect } from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import styles from './styles.module.css';
// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake
const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

// FoalTS
import { initAd } from '../../utils/init';

// FoalTS
let doNotLoad = false;

export default function TOC({className, ...props}) {
  // FoalTS
  const isNotMobile = () => typeof window !== 'undefined' && window.document.body.clientWidth > 996;

  // FoalTS
  useEffect(() => {
    if (isNotMobile() && !doNotLoad) {
      // This line prevents the ad from being loaded twice. I don't why but useEffect
      // is called twice even if window.location.href has not changed.
      doNotLoad = true;
      setTimeout(() => doNotLoad = false, 1000);

      initAd();
    }
  }, [
    // Only execute this effect when the user navigates to a new page.
    typeof window !== 'undefined' ? window.location.href : ''
  ]);

  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar', className)}>
      <TOCItems
        {...props}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />
      {/* FoalTS */}
      {isNotMobile() && <div id="carbon-js"></div>}
    </div>
  );
}
