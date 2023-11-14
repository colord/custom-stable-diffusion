function ImageContainer({ imageSrc, width, height }) {
  return (
    <>
      <div className="image-container">
        {!imageSrc ? (
          <div className='image-placeholder' style={{
            width: `${width}px`,
            height: `${height}px`,
          }}></div>
        ) : (
          <img src={imageSrc} />
        )}
      </div>
    </>
  );
}

export default ImageContainer;