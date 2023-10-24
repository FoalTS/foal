import React from 'react';
import Layout from '@theme/Layout';

// The static files are located in this directory: docs/static/img/who-is-using-foal.
// Don't forget to compress your image before adding it to the directory.

const posts = [
  {
    title: 'sinzy Blogs',
    imageUrl: '/img/who-is-using-foal/blog.sinzy.net.png',
    href: 'https://blog.sinzy.net/',
    // Description in one short sentence.
    description: 'A blog community (currently in Chinese) based on a multi-user blog system powered by FoalTS'
  },
];

export default function WhoIsUsingFoal() {
  return (
    <Layout
      description='Who is using Foal'>
      <div className="tw-px-4 tw-pt-16 tw-pb-20 sm:tw-px-6 lg:tw-px-8" style={{ backgroundColor: '#1b7cf2' }}>
        <div className="tw-mx-auto tw-max-w-7xl">
          <div className="tw-text-center">
            <h2 className="tw-text-3xl tw-text-white tw-font-bold tw-tracking-tight sm:tw-text-4xl">Who is using Foal?</h2>
            <p className="tw-mx-auto tw-mt-3 tw-max-w-2xl tw-text-xl sm:tw-mt-4" style={{ color: '#D1E3FF' }}>
              {/* List of websites using FoalTS */}
              This page is brand new! Add a link to your site!
            </p>
            <a
              href="https://github.com/FoalTS/foal/edit/master/docs/src/pages/who-is-using-foal.jsx"
              className="tw-inline-flex tw-items-center tw-rounded-md tw-border tw-bg-indigo-100 tw-px-4 tw-py-2 tw-text-sm tw-font-medium hover:tw-bg-indigo-200 focus:tw-outline-none hover:tw-no-underline focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-ring-offset-2"
              style={{ color: '#1b7cf2' }}
            >
              Add your site
            </a>
          </div>
          <div className="tw-mx-auto tw-mt-12 tw-grid tw-max-w-lg tw-gap-5 sm:tw-max-w-none sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4">
            {posts.map((post) => (
              <div key={post.title} className="tw-bg-white tw-flex tw-flex-col tw-overflow-hidden tw-rounded-lg tw-shadow-lg">
                <div className="tw-flex-shrink-0">
                  <img className="tw-h-40 tw-w-full tw-object-cover" src={post.imageUrl} alt="" />
                </div>
                <div className="tw-flex tw-flex-1 tw-flex-col tw-justify-between tw-px-4">
                  <div className="tw-flex-1">
                    <a href={post.href} className="tw-mt-2 tw-block">
                      <p className="tw-text-lg tw-font-semibold tw-text-gray-900">{post.title}</p>
                    </a>
                    <p className="tw-text-sm tw-text-gray-500">{post.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout >
  );
}
