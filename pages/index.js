import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import Card from "../components/card";
import { getIcons } from "../lib/api";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { CMS_NAME } from "../lib/constants";
import { useState, Fragment, useEffect } from "react";
// import ScrollReveal from 'scrollreveal'
import { Fade } from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import Reveal from "react-awesome-reveal";

import { styled, css } from "../lib/stitches.config.js";
import * as Tooltip from "@radix-ui/react-tooltip";
import toast, { Toaster } from "react-hot-toast";

import * as JsSearch from "js-search";

export default function Index({ icons, index }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (sent) return;

    if (!email) return;

    console.log(`Submitting Name ${email}`);
    fetch("https://inspyr.sambarrowclough.repl.co", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: email }),
    }).then((r) => {
      console.log(r);
      setSub("Thank you!");
      setSent(true);
    });
  };

  if (false) {
    let opt = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ from: document.referrer }),
    };
    let url = "https://inspyr.sambarrowclough.repl.co/track";
    console.log("tracking..");
    fetch(url, opt).then((r) => {
      console.log("tracked!");
      console.log(r);
    });
  }

  const customAnimation = keyframes`
		from {
			visibility: visible;
			opacity: 0;
			transform: matrix3d(0.95, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
			transition: opacity 1s cubic-bezier(0.5, 0, 0, 1) 0s, transform 1s cubic-bezier(0.5, 0, 0, 1) 0s;
		}

		to {
			visibility: visible;
			opacity: 1;
			transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
			transition: opacity 1s cubic-bezier(0.5, 0, 0, 1) 0s, transform 1s cubic-bezier(0.5, 0, 0, 1) 0s;
		}
	`;

  function MyAnimatedComponent({ children, delay }) {
    return <div>{children}</div>;
  }
  // function MyAnimatedComponent({ children, delay}) {
  // 	return (
  // 		<Reveal
  // 			delay={delay}
  // 			duration='1000'
  // 			keyframes={customAnimation}
  // 			triggerOnce
  // 		>
  // 			{children}
  // 		</Reveal>
  // 	);
  // }

  const handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setEmail(e.target.value);
  };

  var search = new JsSearch.Search("name");
  // search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
  search.addIndex("name");
  search.addDocuments(icons);

  function Search() {
    const [data, setData] = useState([{ item: {} }]);
    const [query, setQuery] = useState("");

    useEffect(() => {
      const fetchData = async () => {
        // const results = icons.length && icons.filter(i => {
        // 	if (i.name.includes(query)) return i
        // })
        let results = search.search(query);
        setData(results);
      };

      fetchData();
    }, [query]);

    const copyIcon = (e) => {
      let target = e.target.closest("button").previousElementSibling;

      toast("Copied!", {
        icon: "👏",
        style: {
          borderRadius: "6px",
          background: "#333",
          color: "#fff",
        },
      });

      navigator.clipboard.writeText(target.value).then(
        function () {
          console.log("Async: Copying to clipboard was successful!");
        },
        function (err) {
          alert("Async: Could not copy text: ", err);
        }
      );
    };

    return (
      <Fragment>
      	<div className="relative flex-inline justify-center">
	        <input
	          placeholder="Search icons"
	          type="text"
	          value={query}
	          className="border-2 px-10 transition-all focus:ring-4 rounded outline-none px-4 py-2"
	          onChange={(event) => setQuery(event.target.value)}
	        />

	        <div className="absolute text-gray-400 top-3 left-2">
	        	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search">
	        		<circle cx="11" cy="11" r="8"></circle>
	        		<line x1="21" y1="21" x2="16.65" y2="16.65"></line><
        		/svg>
	        </div>

	        <div className="absolute right-4 top-3 text-gray-300">
	        	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
	        		<rect x=".5" y=".5" width="19" height="19" rx="3.5" stroke="currentColor"></rect>
	        		<path d="M6.5 16l7-12" stroke="currentColor"></path>
        		</svg>
	        </div>
        </div>

        <div className="icons flex flex-wrap m">
          {data.length &&
            data.map(
              (x, i) =>
                x &&
                x.svg &&
                x.name && (
                  <Tip
                    name={x.name}
                    content={
                      <div key={i}>
                        {x && x.svg && (
                          <input
                            type="text"
                            className="hidden cp"
                            readOnly
                            value={x.svg}
                          />
                        )}
                        {x && x.svg && (
                          <button
                            onClick={copyIcon}
                            className="hover:bg-gray-100 rounded ml-1 mb-1 p-2 flex items-center focus:outline-none focus:ring focus:border-blue-300"
                            dangerouslySetInnerHTML={{ __html: x.svg }}
                          />
                        )}
                      </div>
                    }
                  ></Tip>
                )
            )}
        </div>

        <Toaster />
      </Fragment>
    );
  }

  function Tip({ name, content }) {
    const scaleIn = css.keyframes({
      "0%": { opacity: 0, transform: "scale(0.95)" },
      "100%": { opacity: 1, transform: "scale(1)" },
    });

    const StyledContent = styled(Tooltip.Content, {
      borderRadius: 4,
      padding: "6px 10px",
      fontWeight: 500,
      fontSize: 12,
      backgroundColor: "#111",
      color: "#eee",
      transformOrigin: "var(--radix-tooltip-content-transform-origin)",
      animation: `${scaleIn} 0.08s ease-out`,
    });

    return (
      <Tooltip.Root>
        <Tooltip.Trigger>{content}</Tooltip.Trigger>
        <StyledContent>{name}</StyledContent>
      </Tooltip.Root>
    );
  }

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sub, setSub] = useState("Subscribe for updates");
  const [results, setResults] = useState("");

  return (
    <>
      <Layout>
        <Head>
          <title>
            inspyr - carefully selected pricing pages for inspiration
          </title>
        </Head>
        <Container>
          <div className="mt-8 flex flex-row items-center justify-between">
            <div className="headline">
              <Link as={`/`} href="/">
                <a>
                  <Image src="/inspyr.svg" width="32" height="32" />
                </a>
              </Link>
            </div>

            <div className="flex">
              <div className="mr-6">
                <Link as={`/`} href="/">
                  <a className="text-gray-400 text-sm">Icons</a>
                </Link>
              </div>

              <div>
                <Link as={`/pricing`} href="/pricing">
                  <a className="text-gray-400 text-sm">Pricing Pages</a>
                </Link>
              </div>
            </div>
          </div>

          <Search />

          <form
            onSubmit={handleSubmit}
            className="flex flex-row justify-center mb-16"
          >
            <div>
              <input
                placeholder="Email addres"
                className="bg-gray-100 transition-all focus:ring-2 rounded outline-none px-4 py-2 mr-4"
                type="text"
                value={email}
                onChange={handleChange}
              />
            </div>

            <div>
              <input
                onClick={handleSubmit}
                className="bg-gray-900 text-white rounded px-4 py-2 hover:shadow-sm cursor-pointer transition-all"
                type="button"
                value={sub}
              />
            </div>
          </form>
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  var icons = getIcons();

  return {
    props: { icons },
  };
}
