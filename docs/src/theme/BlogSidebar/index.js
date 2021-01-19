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
    if (isNotMobile() && window.ethicalads) {
      window.ethicalads.load();
    }
  });

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
      {isNotMobile() && <div className="bordered" data-ea-publisher="foalts-org" data-ea-type="image" data-ea-manual="true" id="blog-sidebar"></div>}
    </div>;
}