/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

// FoalTS
let doNotLoad = false;

export default function BlogSidebar({
  sidebar
}) {
  if (sidebar.items.length === 0) {
    return null;
  }

  // FoalTS
  const isNotMobile = () => typeof window !== 'undefined' && window.document.body.clientWidth > 996;

  // FoalTS
  useEffect(() => {
    if (isNotMobile() && !doNotLoad && window.location.href.includes('blog')) {
      console.log('Loading ad blog');

      // This line prevents the ad from being loaded twice. I don't why but useEffect
      // is called twice even if window.location.href has not changed.
      doNotLoad = true;
      setTimeout(() => doNotLoad = false, 1000);

      const script = document.createElement('script');
    
      script.src = "https://media.ethicalads.io/media/client/ethicalads.min.js";
      script.async = true;
    
      document.body.appendChild(script);
    
      return () => {
        document.body.removeChild(script);
      }
    }
  }, [
    // Only execute this effect when the user navigates to a new page.
    typeof window !== 'undefined' ? window.location.href : ''
  ]);

  return <div className={clsx(styles.sidebar, 'thin-scrollbar')}>
      <h3 className={styles.sidebarItemTitle}>{sidebar.title}</h3>
      <ul className={styles.sidebarItemList}>
        {sidebar.items.map(item => {
        return <li key={item.permalink} className={styles.sidebarItem}>
              <Link isNavLink to={item.permalink} className={styles.sidebarItemLink} activeClassName={styles.sidebarItemLinkActive}>
                {item.title}
              </Link>
            </li>;
      })}
      </ul>
      {/* FoalTS */}
      {isNotMobile() && <div className="bordered" data-ea-publisher="foalts-org" data-ea-type="image" id="blog-sidebar"></div>}
    </div>;
}