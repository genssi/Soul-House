const ErrorMessage = () => {
    return (
        <div style={{ textAlign: "center" }}>
            <img
                style={{
                    display: "block",
                    width: "250px",
                    height: "250px",
                    objectFit: "contain",
                    margin: "0 auto",
                }}
                src="https://media.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif" // Прямая ссылка на GIF
                alt="Error"
            />
        </div>
    );
}

export default ErrorMessage;