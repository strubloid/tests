import { useState } from "react";

type User = {
    gender: string;
    name: {
        title: string;
        first: string;
        last: string;
    };
    location: {
        street: {
            number: number;
            name: string;
        };
        city: string;
        state: string;
        country: string;
        postcode: number;
        coordinates: {
            latitude: string;
            longitude: string;
        };
        timezone: {
            offset: string;
            description: string;
        };
    };
    email: string;
    login: {
        uuid: string;
        username: string;
        password: string;
        salt: string;
        md5: string;
        sha1: string;
        sha256: string;
    };
    dob: {
        date: string; // ISO string
        age: number;
    };
    registered: {
        date: string; // ISO string
        age: number;
    };
    phone: string;
    cell: string;
    id: {
        name: string;
        value: string | null;
    };
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
    nat: string;
};

function People() {
    const [page, setPage] = useState(1);
    const [fetching, setFetching] = useState(false);
    // const [randomUser, setRandomUser] = useState<User | null>(null);

    // we add the fetched data to this state
    const [randomUserCollection, setRandomUserCollection] = useState<User[]>([]);

    /**
     * This will be responsible to format the response as a string
     * so we can show at the ui level
     * @returns
     */
    const getStringResponse = (user: User | null) => {
        return user ? JSON.stringify(user, null, 2) : "";
    };

    /**
     * This will be responsible to get the current user name if we have a user loaded
     * @returns {string} The current user's name or a default message if no user is loaded
     */
    const getCurrentUserName = (user: User | null) => {
        return user ? `${user.name.first} ${user.name.last}` : "No user loaded";
    };

    const getCurrentUserPictureThumbnail = (user: User | null) => {
        return user ? user.picture.thumbnail : "";
    };

    /**
     * This will be responsible to fetch the data from the apiURL
     * so we can show the data
     */
    const fetchPeople = async () => {
        try {
            const apiUrl = `https://randomuser.me/api?page=${page}`;
            // loading the request for the apiURl
            let response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    Accepted: "application/json",
                    "Content-Type": "application/json",
                },
            });

            // checking if the response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // parsing the response to json
            const data = await response.json();

            // checking if the json is valid
            if (!data || !data.results) {
                throw new Error("Invalid data format received from API");
            }

            console.log(data.results);

            // we set the current user
            // setRandomUser(data.results[0]);

            // we update the collection of users with the new user loaded
            setRandomUserCollection((prevCollection) => [...prevCollection, data.results[0]]);

            // we update the page to load the next user
            setPage((prev) => prev + 1);
        } catch (error) {
            console.error("Error fetching people:", error);
        } finally {
            // we need to set the fetching to false because we are done with the request
            setFetching(false);
        }
    };

    return (
        <>
            <h2>People</h2>
            <div className="people">{fetching ? <h2>People loading...</h2> : null}</div>
            <div className="actions">
                <button type="button" className="btn" onClick={fetchPeople}>
                    Fetch People
                </button>
            </div>
            <div className="response">
                {randomUserCollection.length > 0 && (
                    <div>
                        <h3>Random User Collection:</h3>
                        <ul>
                            {randomUserCollection.map((user, index) => (
                                <li key={index}>
                                    <p>Name: {getCurrentUserName(user)}</p>
                                    <img src={getCurrentUserPictureThumbnail(user)} alt="user thumbnail" />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {/* <pre>{getStringResponse()}</pre> */}
        </>
    );
}

export default People;
