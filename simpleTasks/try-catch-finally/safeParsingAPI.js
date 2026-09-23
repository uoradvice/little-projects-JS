async function fetchUserProfile(url) {
    try{
        const response = await fetch(url);
        if (!response.ok) {
            throw new TypeError(`Response failed with status: ${response.status}`);
        }

        const userData = await response.json();
        return userData;
    } catch (error){
        console.log(error.name, error.message);
        return null;
    } finally {
        console.log("Request finished");
    }

}

async function main(){
    const user = await
        fetchUserProfile("https://jsonplaceholder.typicode.com/users/1"); // correct
        // fetchUserProfile("https://invalid.example.test/users/1"); // fetch error
        // fetchUserProfile("https://jsonplaceholder.typicode.com/users/9999"); // json error

    if(user){
        console.log("User:", user);
    } else {
        console.log("Can not load user");
    }
}

main();