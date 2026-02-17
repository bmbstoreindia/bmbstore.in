import { useAppContext } from "../context/app.context";

const ApiLoader = () => {
  const { showloader } = useAppContext();

  if (!showloader) return null;

  return (
    <>
      {/* BACKDROP (blocks everything) */}
      <div className="api-loader-backdrop" />

      {/* LOADER */}
      <div className="api-loader-bar" />
    </>
  );
};

export default ApiLoader;
