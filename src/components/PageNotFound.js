import page_not_found_img from "../images/404.png";

function PageNotFound() {
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div>
        <img
          alt="Playing card with value 404 of clubs that says 'Page Not Found'"
          src={page_not_found_img}
          className="mw-306px"
        />
        <a href="/" className="d-block my-3 text-center">
          Back to Homepage
        </a>
      </div>
    </div>
  );
}

export default PageNotFound;
