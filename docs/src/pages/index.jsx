import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.scss';

const features = [
  {
    title: 'All-inclusive',
    description: (
      <>
        Achieve more by reusing ready-made components.
        <br />
        <br />
        You don't need to rebuild everything from scratch
        or waste time finding all the pieces you need on
        npm and making them work together. The foundation
        is already there.
      </>
    ),
  },
  {
    title: 'Expressive code',
    description: (
      <>
        Foal always strives to provide you with the simplest possible code.
        <br />
        <br />
        Complexity and unnecessary abstractions are put aside. The components
        are designed to be easy to use and understand, so you don't have to
        spend more time reading the documentation than you do coding.
      </>
    ),
  },
  {
    title: 'TypeScript Based',
    description: (
      <>
        TypeScript brings you optional static type-checking along with the
        latest ECMAScript features.
        <br />
        <br />
        This allows you to detect most silly
        errors during compilation and improve the quality of your code.
        It also offers you autocompletion and a well documented API.
      </>
    ),
  },
];

function Feature({ title, description }) {
  return (
    <div className={styles.col}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      description="Elegant and all-inclusive Node.Js web framework based on TypeScript.">
        <header className={styles.masthead}>
          <div className={styles.content}>
            <h1>{siteConfig.title}</h1>
            <h3>{siteConfig.tagline}</h3>
            <div>
              <Link
                className={styles.btn}
                to={useBaseUrl("docs/tutorials/simple-todo-list/1-installation")}>
                Get started
              </Link>
            </div>
          </div>
        </header>
        <section className={styles.main}>
          <div>
            <img src={useBaseUrl('img/home/screenshot.png')} alt="" />
          </div>
          {features && features.length > 0 && (
            <section className={styles.features}>
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </section>
          )}
          <div>
            <Link
              className={styles.btn}
              to={useBaseUrl("docs/tutorials/simple-todo-list/1-installation")}>
              Get started
            </Link>
          </div>
        </section>
    </Layout>
  );
}

export default Home;
