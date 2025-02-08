import { useParams } from "react-router-dom";

function HomeScreen() {
    const { userId } = useParams();

    return (
        < >
            <div>Bienvenido, usuario con ID: {userId}</div>
        </>);
};

export default HomeScreen;
