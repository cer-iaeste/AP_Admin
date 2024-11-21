import "./Loader.css"

const Loader = () => {
    return (
        <div className="h-screen w-full bg-gradient flex items-center justify-center">
          <div className="loader relative">
            <div className="wheel"></div>
            <div className="electric-spark"></div>
          </div>
        </div>
      );
};

export default Loader;