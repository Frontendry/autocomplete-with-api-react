import React, { useRef, useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { Form } from "react-bootstrap";

import Spinner from "./Spinner";

function Search() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("react");
  const [loading, setLoading] = useState(false);

  const { Group, Control } = Form;
  const url = "https://hn.algolia.com/api/v1/search?query=";
  const debounceDelay = 500;

  const fetchData = async (urlStr, queryStr) => {
    setLoading(true);
    const res = await fetch(`${urlStr}${queryStr}`);
    const json = await res.json();
    setLoading(false);
    setData(json.hits);
  };

  const changeHandler = (event) => {
    setQuery(event.target.value);
  };

  // Great article right here - https://dmitripavlutin.com/react-throttle-debounce/- for why we are using UseMemo
  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, debounceDelay),
    []
  );

  const inputRef = useRef();

  useEffect(() => {
    // Default Setting for Input value(<Control). <Control value={query} type="text" /> will not work because of useMemo on debouncedChangeHandler
    inputRef.current.value = query;

    fetchData(url, query);

    // Cleanup. Stop the invocation of the debounced function after unmounting
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [query, debouncedChangeHandler]);

  return (
    <>
      <Form className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto">
              <Group className="position-relative">
                <Control
                  type="text"
                  placeholder="Search Here"
                  onChange={debouncedChangeHandler}
                  ref={inputRef}
                />

                {loading && <Spinner />}
              </Group>

              <ul className="mt-3">
                {data.map((item) => (
                  <li key={item.ObjectId}>
                    <a href={item.url}>{item.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}

export default Search;
