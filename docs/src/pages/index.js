import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.scss';

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      description={siteConfig.description}>
        <div className={styles.container}>
          <header className={styles.masthead}>
            <div className={`container ${styles.content}`}>
              <div className="row">
                <div className="col-lg-12 d-flex flex-column justify-content-center px-4">
                  <h1 className="text-center">{siteConfig.title}</h1>
                  <h3 className="text-center">{siteConfig.tagline}</h3>
                  <h4 className="text-center">Simple, intuitive and feature-complete.</h4>
                  <div className={styles.terminalWrapper}>
                    <div className={`${styles.terminal} m-auto`}>
                      <span className="text-muted">{'>'}</span> npm install -g @foal/cli<br />
                        <span className="text-muted">{'>'}</span> foal createapp my-app<br />
                        <span className="text-muted">{'>'}</span> cd my-app<br />
                        <span className="text-muted">{'>'}</span> npm run develop
                    </div>
                  </div>
                  <div className="text-center">
                    <a href="https://foalts.gitbook.io/docs/tutorials/simple-to-do-list/1-installation" className={`${styles.btn} mt-3 ${styles.btnWhite}`} id="get-started">
                      Get started
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className={styles.screenshotContainer}>
            <img src={useBaseUrl('img/home/screenshot.png')} alt="" />
          </section>

          <section className={styles.featureSection}>
            <div className="container">
              <div className="row">
                <div className="col-md-6 d-flex">
                  <div className="flex-fill p-md-4">
                    <h4>TypeScript</h4>
                    <h5>JavaScript that scales.</h5>
                    <p className="text-justify mb-0">
                      TypeScript brings you optional static type-checking along with the latest ECMAScript
                      features. Writing FoalTS with TypeScript has been and will always be fundamental. Code
                      is more elegant and concise. Most of the silly mistakes are caught at compilation. And
                      autocompletion is well-handled and the API is better documented.
                    </p>
                  </div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                  <img src={useBaseUrl('img/home/typescript3.png')} className="mt-3 mt-md-0" />
                </div>
              </div>
            </div>
          </section>
          <section className={styles.featureSection}>
            <div className="container">
              <div className="row">
                <div className="col-md-6 d-flex order-md-last">
                  <div className="flex-fill p-md-4">
                    <h4>Simple and Intuitive</h4>
                    <h5>No magic. No overengineering.</h5>
                    <p className="text-justify mb-0">
                      Keeping things simple is a challenge when creating an application.
                      Simple code is easier to handle and understand, and therefore easier
                      to maintain, debug and extend. Many frameworks, in trying to provide
                      a large number of features and tools, tend to become complex, cumbersome
                      and sometimes incomprehensible. In Foal, the architecture and components
                      are designed to keep the code as simple as possible. Complexity is only
                      used when there is no other option.
                    </p>
                  </div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                  <img src={useBaseUrl('img/home/simple-and-intuitive4.png')} className="mt-3 mt-md-0" />
                </div>
              </div>
            </div>
          </section>

          <section className={`${styles.featureSection} pb-4`}>
            <div className="container">
              <div className="row">
                <div className="col-md-6 d-flex">
                  <div className="flex-fill p-md-4">
                    <h4>Batteries Included</h4>
                    <h5>Auth, ORM, CLI, Scripts, OpenAPI, GraphQL, ...</h5>
                    <p className="text-justify mb-0">
                      Validation, authentication, sanitiziation, error handling, compilation,
                      CLI, job scheduling, password hashing, permission management, token
                      generation, ..., most web applications need these features and developers
                      should not spend their time re-inventing the wheel. FoalTS allows you to
                      be productive and focus on business logic rather than wasting your time
                      building everything from scratch.
                    </p>
                  </div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-center order-last">
                  <img src={useBaseUrl('img/home/batteries-included4.png')} className="mt-3 mt-md-0" />
                </div>
              </div>
            </div>
          </section>

          <section className={styles.getStartedContainer}>
            <a href="https://foalts.gitbook.io/docs/tutorials/simple-to-do-list/1-installation" className={`${styles.btn} ${styles.btnWhite}`} id="get-started2">
              Get started
            </a>
          </section>

          <section className={styles.badgesContainer}>
            <div className="container">
              <a href="https://github.com/FoalTS/foal/blob/master/LICENSE">
                <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
              </a>
              <img src="https://img.shields.io/badge/node-%3E%3D8-brightgreen.svg" alt="node version" />
              <a href="https://badge.fury.io/js/%40foal%2Fcore">
                <img src="https://badge.fury.io/js/%40foal%2Fcore.svg" alt="npm version" />
              </a>
              <a href="https://travis-ci.org/FoalTS/foal">
                <img src="https://travis-ci.org/FoalTS/foal.svg?branch=add-travis" alt="Build Status" />
              </a>
              <a href="https://codecov.io/github/FoalTS/foal">
                <img src="https://codecov.io/gh/FoalTS/foal/branch/master/graphs/badge.svg" alt="Code coverage" />
              </a>
              <a href="https://snyk.io/test/npm/@foal/core">
                <img src="https://snyk.io/test/npm/@foal/core/badge.svg" alt="Known Vulnerabilities" />
              </a>
              <a href="https://github.com/FoalTS/foal/commits/master">
                <img src="https://img.shields.io/github/commit-activity/y/FoalTS/foal.svg" alt="Commit activity" />
              </a>
              <a href="https://github.com/FoalTS/foal/commits/master">
                <img src="https://img.shields.io/github/last-commit/FoalTS/foal.svg" alt="Last commit" />
              </a>
              <a href="https://img.shields.io/badge/2FA-npm,%20GitHub-green.svg">
                <img src="https://img.shields.io/badge/2FA-npm,%20GitHub-green.svg" alt="2FA" />
              </a>
            </div>
          </section>
          <footer className={styles.mastfoot}>
          Code licensed under MIT License.
        </footer>
      </div>
    </Layout>
  );
}

export default Home;
