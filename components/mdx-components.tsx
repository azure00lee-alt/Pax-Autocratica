import type {MDXComponents} from 'mdx/types';
import {Callout} from './callout';

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className="article-heading" {...props} />,
  h3: (props) => <h3 className="article-subheading" {...props} />,
  table: (props) => <div className="table-scroll"><table {...props} /></div>,
  a: (props) => <a {...props} target={props.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" />,
  Callout
};
