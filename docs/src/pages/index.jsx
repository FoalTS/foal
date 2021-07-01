import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.scss';

function FeatureCell(props) {
  return (
    <div className={styles.featureCell}>
      <div className={styles.featureSymbol}>
        ›
      </div>
      <div className={styles.featureContent}>
        <h3>{props.title}</h3>
        <p>{props.children}</p>
      </div>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  return (
    <Layout  
      description="Elegant and complete Node.Js web framework based on TypeScript.">
        <header className={styles.masthead}>
          <div className={styles.content}>
            <h1>The elegant and complete <strong>NodeJS</strong> framework</h1>
            <h3>Simple, flexible and fully-featured.</h3>
            <div>
              <Link
                className={styles.btn}
                to={useBaseUrl("docs/tutorials/simple-todo-list/1-installation")}>
                Get started
              </Link>
              <Link
                className={`${styles.btn} ${styles.btnSecondary}`}
                to="https://discord.gg/QUrJv98">
                Join the chat
              </Link>
            </div>
          </div>
        </header>
        <section>
          <div className={styles.screenshotContainer}>
            <img src={useBaseUrl('img/home/screenshot.png')} alt="" />
          </div>
          <div className={`${styles.metrics} ${styles.section2} ${styles.smallSection}`}>
            <div>
              <div className={styles.number}>2,100<span className={styles.plus}>+</span></div>
              <div className={styles.caption}>acceptance <br/> and unit tests</div>
            </div>
            <div>
              <div className={styles.number}>11,000<span className={styles.plus}>+</span></div>
              <div className={styles.caption}>lines of <br/>documentation</div>
            </div>
            <div>
              <div className={styles.number}>4 years</div>
              <div className={styles.caption}>of active <br/>development</div>
            </div>
          </div>
          <div className={`${styles.section1} ${styles.feature}`}>
            <div className={styles.col1}>
              <h2>All-in-One Framework</h2>
              <p>
                The foundation is already there.
                You don't have to rebuild everything from scratch or make 3rd-party packages work together.
                Everything is included.
                <br/>
                <br/>
                But if you wish, you can still import and use your favorite libraries. The framework is extensible.
              </p>
            </div>
            <div className={styles.col2}>
              <div className={styles.featureRow}>
                <FeatureCell title="CLI">
                  Build and run your app in development and in production. Generate files.
                </FeatureCell>
                <FeatureCell title="ORM">
                  Take advantage of TypeORM and generate migrations from your models.
                </FeatureCell>
              </div>
              <div className={styles.featureRow}>
                <FeatureCell title="JWTs and Session Tokens">
                  Implement stateful or stateless authentication with cookies or the Authorization header.
                </FeatureCell>
                <FeatureCell title="Unit and E2E tests">
                  Write automated tests with a ready-made environment.
                </FeatureCell>
              </div>
              <div className={styles.featureRow}>
                <FeatureCell title="Swagger Generation">
                  Generate an OpenAPI specification and a Swagger page directly from your code.
                </FeatureCell>
                <FeatureCell title="Roles and Permissions">
                  Control routes access with static roles or dynamic permissions.
                </FeatureCell>
              </div>
              <div className={styles.featureRow}>
                <FeatureCell title="Shell Scripts">
                  Create scripts to be run from the command line with argument validation.
                </FeatureCell>
                <FeatureCell title="File Upload and Storage">
                  Validate uploaded files and save them in local or in the Cloud (AWS S3).
                </FeatureCell>
              </div>
            </div>
          </div>
          <div className={`${styles.section2} ${styles.feature}`}>
            <div className={styles.col2}>
              <div className={styles.featureImageWrapperLeft}>
                <img src={useBaseUrl('img/home/typescript.png')} alt=""  />
              </div>
            </div>
            <div className={styles.col1}>
              <h2>TypeScript Support</h2>
              <p>
                Thanks to TypeScript, most of your careless errors are caught during compilation
                and the overall quality of your code is improved. The language also offers
                you autocompletion and a well-documented API.
              </p>
            </div>
          </div>
          <div className={`${styles.section1} ${styles.feature}`}>
            <div className={styles.col1}>
              <h2>Simple and Intuitive Architecture</h2>
              <p>
                In Foal, you only manage three concepts: controllers, services and hooks.
                <br/>
                <br/>
                Complexity and unnecessary abstractions are set aside
                so that you spend more time coding rather than reading the documentation.
                <br />
                <br />
                No steep learning curve or over-engineering here.
              </p>
            </div>
            <div className={styles.col2}>
              <div className={styles.featureImageWrapperRight}>
                <img src={useBaseUrl('img/home/architecture2.png')} alt="" className={styles.codeImage} />
              </div>
            </div>
          </div>
          <div className={`${styles.section2} ${styles.testimonials}`}>
            <h2>What they say about Foal</h2>
          </div>
          <div className={`${styles.section1} ${styles.getStarted}`}>
            <Link
              className={`${styles.btn} ${styles.btnMedium} ${styles.btnPrimary}`}
              to={useBaseUrl("docs/tutorials/simple-todo-list/1-installation")}>
              Get started
            </Link>
          </div>
        </section>
    </Layout>
  );
}

export default Home;
