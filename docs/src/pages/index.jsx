import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GitHubButton from 'react-github-btn';
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

function CompanyLogo({ imageSrc, href, companyName }) {
  return (
    <a href={href} class="tw-basis-1/2 sm:tw-basis-1/3 lg:tw-basis-1/6 tw-flex tw-items-center  tw-justify-center" target="_blank">
      <div className="tw-col-span-1 tw-flex tw-justify-center tw-py-8 tw-px-8 tw-bg-gray-50">
        <img
          className="tw-max-h-12"
          src={`${imageSrc}`}
          alt={companyName}
        />
      </div>
    </a>
  );
}

function PlusLogo() {
  return (
    <a href="https://github.com/sponsors/LoicPoullain" class="tw-basis-1/2 sm:tw-basis-1/3 lg:tw-basis-1/6 tw-flex tw-items-center tw-justify-center" target="_blank">
      <div className="tw-col-span-1 tw-flex tw-justify-center tw-py-8 tw-px-8 tw-bg-gray-50 tw-text-gray-300">
        <div className="tw-border tw-border-solid tw-rounded-lg tw-border-gray-300 tw-flex tw-justify-center tw-py-3 tw-px-14">
          <svg class="tw-w-8 tw-h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        </div>
      </div>
    </a>
  );
}

function CompanyLogos() {
  return (
    <div>
      <div className="tw-max-w-7xl tw-mx-auto tw-py-6 tw-px-4 sm:tw-px-6 lg:tw-py-12 lg:tw-px-8">
        <p className="tw-text-center tw-text-lg tw-font-semibold tw-text-gray-600 tw-uppercase tw-mb-0">
          Sponsored by
        </p>
        <div className="tw-flex tw-justify-center tw-flex-wrap">
          <CompanyLogo imageSrc={useBaseUrl('img/trusted-by/linito.png')} companyName="Linito" href="https://linito.io" />
          <PlusLogo />
        </div>
      </div>
    </div>
  )
}

function sendGA4EventOnLink(
  event,
  eventName,
) {
  event.preventDefault()

  window.dataLayer?.push([
    'event',
    eventName,
    {
      event_callback: function () {
        window.location.href
      },
    },
  ])

  // Fallback
  setTimeout(() => {
    window.location.href = event.target.href
  }, 300)
}

function Home() {
  const context = useDocusaurusContext();
  return (
    <Layout
      description="Full-featured Node.js framework, with no complexity">
      <header className={styles.masthead}>
        <div className={styles.content}>
          <h1>Full-featured Node.js framework</h1>
          <h3>
            <span>Simple and easy to use</span>
            <span> - </span>
            <span>TypeScript-based</span>
            <span> - </span>
            <span>Well-documented</span>
          </h3>
          <div>
            <Link
              onClick={(event) => sendGA4EventOnLink(event, 'click_get_started')}
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
          <div className={styles.githubBtns}>
            <GitHubButton
              href="https://github.com/FoalTS/foal"
              data-icon="octicon-star"
              data-size="large"
              data-show-count="true"
              aria-label="Star FoalTS/foal on GitHub">
              Star
            </GitHubButton>
            <GitHubButton
              href="https://github.com/sponsors/LoicPoullain"
              data-icon="octicon-heart"
              data-size="large"
              aria-label="Sponsor @FoalTS on GitHub">
              Sponsor
            </GitHubButton>
          </div>
        </div>
      </header>
      <section>
        <div className={styles.screenshotContainer}>
          <img src={useBaseUrl('img/home/screenshot.png')} alt="" />
        </div>
        <div className={styles.bgWhite}>
          <CompanyLogos />
        </div>
        <div className={styles.allInOneSection}>
          <div className={styles.feature}>
            <div className={styles.col1}>
              <h2>All-in-One Framework 🚀</h2>
              <p>
                The foundation is already there.
                <strong>You don't have to rebuild everything from scratch</strong> or find and make 3rd-party packages work together.
                Everything is included.
                <br />
                <br />
                But if you wish, you can still import and use your favorite libraries. <strong>The framework is extensible</strong>.
              </p>
            </div>
            <div className={styles.col2}>
              <div className={styles.featuresWrapper}>
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
                    Write automated tests with a ready-to-use environment and a simple dependency injection system.
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
          </div>
        </div>
        <div className={styles.architectureSection}>
          <div className={styles.feature}>
            <div className={styles.col1}>
              <h2>Simple and Intuitive</h2>
              <p>
                In Foal, you <strong>only</strong> manage <strong>three concepts</strong>: controllers, services and hooks.
                <br />
                <br />
                Complexity and unnecessary abstractions are set aside
                so that you spend more time coding rather than reading the documentation.
                <br />
                <br />
                <strong>No steep learning curve</strong> or over-engineering here.
              </p>
            </div>
            <div className={styles.col2}>
              <div className={styles.architectureWrapper}>
                <img src={useBaseUrl('img/home/architecture2.png')} alt="" className={styles.codeImage} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.typescriptSection}>
          <div className={styles.feature}>
            <div className={styles.col2}>
              <div className={styles.typescriptWrapper}>
                <div>
                  <svg viewBox="0 0 27 26" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="m.98608 0h24.32332c.5446 0 .9861.436522.9861.975v24.05c0 .5385-.4415.975-.9861.975h-24.32332c-.544597 0-.98608-.4365-.98608-.975v-24.05c0-.538478.441483-.975.98608-.975zm13.63142 13.8324v-2.1324h-9.35841v2.1324h3.34111v9.4946h2.6598v-9.4946zm1.0604 9.2439c.4289.2162.9362.3784 1.5218.4865.5857.1081 1.2029.1622 1.8518.1622.6324 0 1.2331-.0595 1.8023-.1784.5691-.1189 1.0681-.3149 1.497-.5879s.7685-.6297 1.0187-1.0703.3753-.9852.3753-1.6339c0-.4703-.0715-.8824-.2145-1.2365-.1429-.3541-.3491-.669-.6186-.9447-.2694-.2757-.5925-.523-.9692-.7419s-.8014-.4257-1.2743-.6203c-.3465-.1406-.6572-.2771-.9321-.4095-.275-.1324-.5087-.2676-.7011-.4054-.1925-.1379-.3409-.2838-.4454-.4379-.1045-.154-.1567-.3284-.1567-.523 0-.1784.0467-.3392.1402-.4824.0935-.1433.2254-.2663.3959-.369s.3794-.1824.6269-.2392c.2474-.0567.5224-.0851.8248-.0851.22 0 .4523.0162.697.0486.2447.0325.4908.0825.7382.15.2475.0676.4881.1527.7218.2555.2337.1027.4495.2216.6475.3567v-2.4244c-.4015-.1514-.84-.2636-1.3157-.3365-.4756-.073-1.0214-.1095-1.6373-.1095-.6268 0-1.2207.0662-1.7816.1987-.5609.1324-1.0544.3392-1.4806.6203s-.763.6392-1.0104 1.0743c-.2475.4352-.3712.9555-.3712 1.5609 0 .7731.2268 1.4326.6805 1.9785.4537.546 1.1424 1.0082 2.0662 1.3866.363.146.7011.2892 1.0146.4298.3134.1405.5842.2865.8124.4378.2282.1514.4083.3162.5403.4946s.198.3811.198.6082c0 .1676-.0413.323-.1238.4662-.0825.1433-.2076.2676-.3753.373s-.3766.1879-.6268.2473c-.2502.0595-.5431.0892-.8785.0892-.5719 0-1.1383-.0986-1.6992-.2959-.5608-.1973-1.0805-.4933-1.5589-.8879z" fillRule="evenodd"></path></svg>
                  <strong>TypeScript</strong>
                </div>
              </div>
            </div>
            <div className={styles.col1}>
              <h2>Robust Language</h2>
              <p>
                Foal leverages <strong>TypeScript</strong> to improve the overall quality of your code
                and detect most of your careless errors during compilation.
                The language also gives you <strong>autocompletion</strong> and a <strong>well-documented API</strong>.
              </p>
            </div>
          </div>
        </div>
        <div className={styles.getStartedSection}>
          <div className={styles.getStarted}>
            <Link
              className={styles.btn}
              to={useBaseUrl("docs/tutorials/simple-todo-list/1-installation")}>
              Get started
            </Link>
          </div>
        </div>
        <footer className={styles.footerWrapper}>
          <div className={styles.footer}>
            <a className={styles.githubLink} href="https://github.com/FoalTS/foal"></a>
            <a className={styles.twitterLink} href="https://twitter.com/FoalTs"></a>
            <a className={styles.youtubeLink} href="https://www.youtube.com/channel/UCQFojM334E0YdoDq56MjfOQ"></a>
            <a className={styles.chatLink} href="https://discord.gg/QUrJv98"></a>
          </div>
        </footer>
      </section>
    </Layout>
  );
}

export default Home;
