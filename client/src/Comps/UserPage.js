import React from "react";

const UserPage = (props) => {

    const { user } = props;

    console.log(user)

    return (
        <div>
            <p>{user.name}</p>
            <p>{user.email}</p>
        </div>
    )

}

export default UserPage