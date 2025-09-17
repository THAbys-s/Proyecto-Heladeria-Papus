import "./loading.css";

const Loading = ({ fade }) => {
  return (
    <div className={`loop-wrapper ${fade ? "fade-out" : ""}`}>
      <div className="mountain"></div>
      <div className="hill"></div>
      <div className="tree"></div>
      <div className="tree"></div>
      <div className="tree"></div>
      <div className="rock"></div>
      <div className="truck"></div>
      <div className="wheels"></div>
      <div className="helado"></div>
      <div className="palos"></div>
    </div>
  );
};

export default Loading;
