function AppContainer({ children }) {
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div>{children}</div>
    </div>
  );
}

export default AppContainer;
