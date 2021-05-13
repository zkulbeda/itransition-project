import Layout from "./Layout";
import {Alert, Button} from "react-bootstrap";
import {useRouter} from "next/router";

export default function AccessForbiddenUntilLogInPage(){
    let router = useRouter()
    return (
        <Layout>
            <Alert variant="danger" >
                <Alert.Heading>Sorry, you can't see this page!</Alert.Heading>
                <p>
                    Access forbidden. Log in to see the page.
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => router.push("/login")} variant="outline-danger">
                        Log in
                    </Button>
                </div>
            </Alert>
        </Layout>
    );
}
