import {gql} from "@apollo/client"

//USER
export const REGISTER_USER = gql`
    mutation register($name: String!, $email: String!, $username: String!, $password: String!, $google: String!, $profile: String!) {
        createUser(input: {
            name: $name
            email: $email
            username: $username
            password: $password
            google: $google
            profile: $profile
        }) {
            activated
            activationID
            id
            name
            email
            username
            google
            profile
        }
    }
`

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!, $google: String!) {
        Login(input: {
            email: $email
            password: $password
            google: $google
        }) {
            activated
            activationID
            id
            name
            email
            username
            profile
            headline
            cover
            followed
            connected
            requestconnect
            blocked
            views
            google
        }
    }
`

export const ACTIVATE_USER = gql`
    mutation veruser($activationID: ID!) {
        activateUser(input: {
            activationID: $activationID
        }) {
            activated
            activationID
            id
            name
            email
            username
            profile
            headline
            cover
            followed
            connected
            requestconnect
            blocked
            views
            google
        }
    }
`

export const RESET_USER = gql`
    mutation respass($email: String!) {
        resetPass(input: {
            email: $email
        }) {
            activated
            activationID
            id
            name
            email
            username
            profile
            headline
            cover
            followed
            connected
            requestconnect
            blocked
            views
            resetID
            google
        }
    }
`

export const GET_RESET_CODE = gql`
    mutation resetcode($resetID: ID!) {
        resetCode(input: {
            resetID: $resetID
        }) {
            activated
            activationID
            id
            name
            email
            username
            profile
            headline
            cover
            followed
            connected
            requestconnect
            blocked
            views
            resetID
            google
        }
    }
`

export const SET_PASS = gql `
    mutation resetpass($email: String!, $password: String!) {
        setPass(input: {
            email: $email
            password: $password
        }) {
            activated
            activationID
            id
            name
            email
            username
            profile
            headline
            cover
            followed
            connected
            requestconnect
            blocked
            views
            google
        }
    }
`

export const GET_USER_UNAME = gql `
    query useruname($username: String!){
        UserbyUname(username: $username) {
            id
            profile
            name
            email
            username
            headline
            cover
            followed
            connected
            requestconnect
            blocked
            views
            activated
            activationID
        }
    }
`

export const GET_USER_ID = gql `
    query userid($id: ID!){
        UserbyID(id: $id) {
            id
            profile
            name
            email
            username
            headline
            cover
            followed
            connected
            requestconnect
            blocked
            views
            activated
            activationID
        }
    }

`

export const SEND_CONNECT_USER = gql `
    mutation connect($id: ID!, $id2: ID!) {
        sendConnect(input: {
            id: $id
            id2: $id2
        }) {
            id
            name
            email
            username
            profile
            headline
            cover
            followed
            connected
            requestconnect
            blocked
            views
            password
        }
    }
`
export const ACCEPT_CONNECT = gql `
    mutation accceptconnect($id: ID!, $id2: ID!) {
        acceptConnect(input: {
            id: $id
            id2: $id2
        }) {
            id
            name
            email
            username
            profile
            headline
            cover
            followed
            connected
            requestconnect
            blocked
            views
            password
        }
    }
`

export const TOGGLE_FOLLOW = gql `
    mutation follow($id: ID!, $id2: ID!) {
        toggleFollow(input: {
            id: $id
            id2: $id2
        }) {
            id
            name
            email
            username
            profile
            headline
            cover
            followed
            connected
            requestconnect
            blocked
            views
            password
        }
    }
`

export const TOGGLE_BLOCK = gql `
    mutation block($id: ID!, $id2: ID!) {
        toggleBlock(input: {
            id: $id
            id2: $id2
        }) {
            id
            name
            email
            username
            profile
            headline
            cover
            followed
            connected
            requestconnect
            blocked
            views
            password
        }
    }
`

export const ADD_VIEW = gql `
    mutation addview($username: String!){
        addView(username: $username) {
            id
            profile
            name
            email
            username
            headline
            cover
            followed
            connected
            requestconnect
            blocked
            views
            activated
            activationID
        }
    }
`
export const UPDATE_PROFILE = gql`
    mutation updateprofile($id: ID!, $name: String!, $profile: String!, $headline: String!, $cover: String!) {
        setProfile(input: {
            id: $id
            name: $name
            profile: $profile
            headline: $headline
            cover: $cover
        }) {
            id
            name
            profile
            headline
            cover
        }
    }
`

export const GET_USERS = gql `
    query allUsers{
        Users {
            id
            profile
            headline
            cover
            name
            email
            username
            followed
            connected
            requestconnect
            blocked
            views
        }
    }
`

//EXPERIENCE
export const GET_EXP_ID = gql `
    query expid($id: ID!){
        ExperiencebyID(id: $id) {
        id
        userID
        title
        type
        company
        country
        isActive
        startYear
        endYear
        }
    }
`

export const GET_EXPS_USER = gql `
    query expuserid($userID: ID!){
        ExperiencesbyUserID(userID: $userID) {
        id
        userID
        title
        type
        company
        country
        isActive
        startYear
        endYear
        }
    }
`

export const ADD_EXP = gql `
    mutation newexp($userId: ID!, $title: String!, $type: String!, $company: String!, $country: String!, $isActive: Boolean!, $startYear: Int!, $endYear: Int!) {
        createExp(input: {
            userID: $userId
            title: $title
            type: $type
            company: $company
            country: $country
            isActive: $isActive
            startYear: $startYear
            endYear: $endYear
        }) {
            id
            userID
            title
            type
            company
            country
            isActive
            startYear
            endYear
        }
    }
`

export const SET_EXP = gql `
    mutation setexp($id: ID!, $userId: ID!, $title: String!, $type: String!, $company: String!, $country: String!, $isActive: Boolean!, $startYear: Int!, $endYear: Int!) {
        setExp(input: {
            id: $id
            userID: $userId
            title: $title
            type: $type
            company: $company
            country: $country
            isActive: $isActive
            startYear: $startYear
            endYear: $endYear
        }) {
            id
            userID
            title
            type
            company
            country
            isActive
            startYear
            endYear
        }
    }
`

export const DEL_EXP = gql `
    mutation delexp($id: ID!){
        deleteExp(id: $id) {
        id
        userID
        title
        type
        company
        country
        isActive
        startYear
        endYear
        }
    }
`

// EDUCATION
export const GET_EDU_ID = gql `
    query eduid($id: ID!){
        EducationbyID(id: $id) {
        id
        userID
        institution
        degree
        field
        grade
        isActive
        startYear
        endYear
        activities
        desc
        }
    }    
`

export const GET_EDUS_USER = gql`
    query eduuserid($userID: ID!){
        EducationsbyUserID(userID: $userID) {
        id
        userID
        institution
        degree
        field
        grade
        isActive
        startYear
        endYear
        activities
        desc
        }
    }    
`

export const ADD_EDU = gql `
    mutation newedu($userId: ID!, $institution: String!, $degree: String!, $field: String!, $grade: Float!, $isActive: Boolean!, $startYear: Int!, $endYear: Int!, $activities: String!, $desc: String!) {
        createEdu(input: {
            userID: $userId
            institution: $institution
            degree: $degree
            field: $field
            grade: $grade
            isActive: $isActive
            startYear: $startYear
            endYear: $endYear
            activities: $activities
            desc: $desc
        }) {
            id
            userID
            institution
            degree
            field
            grade
            isActive
            startYear
            endYear
            activities
            desc
        }
    }
`

export const SET_EDU = gql `
    mutation setedu($id: ID!, $userId: ID!, $institution: String!, $degree: String!, $field: String!, $grade: Float!, $isActive: Boolean!, $startYear: Int!, $endYear: Int!, $activities: String!, $desc: String!) {
        setEdu(input: {
            id: $id
            userID: $userId
            institution: $institution
            degree: $degree
            field: $field
            grade: $grade
            isActive: $isActive
            startYear: $startYear
            endYear: $endYear
            activities: $activities
            desc: $desc
        }) {
            id
            userID
            institution
            degree
            field
            grade
            isActive
            startYear
            endYear
            activities
            desc
        }
    }
`

export const DEL_EDU = gql `
    mutation deledu($id: ID!){
        deleteEdu(id: $id) {
            id
            userID
            institution
            degree
            field
            grade
            isActive
            startYear
            endYear
            activities
            desc
        }
    }
`

// HASHTAGS
export const GET_HASHTAGS = gql `
    query allHashtags{
        Hashtag {
            id
            content
        }
    }
`

export const NEW_HASHTAG = gql `
    mutation newhashtag($content: String!) {
        createHashtag(content: $content) {
            id
            content
        }
    }
`

// POSTS

export const GET_POSTS = gql `
    query allPosts{
        Post{
            id
            poster
            content
            image
            video
            postdate
            liker
        }
    }
`
export const GET_POST_ID = gql `
    query postid($id: ID!){
        PostbyID(id: $id) {
        id
        poster
        content
        image
        video
        postdate
        liker
        }
    }
`

export const GET_POSTS_POSTER = gql `
    query posterid($poster: ID!){
        PostbyPoster(poster: $poster) {
        id
        poster
        content
        image
        video
        postdate
        liker
        }
    }
`

export const NEW_POST = gql `
    mutation newpost($poster: ID!, $content: String!, $image: String!, $video: String!, $postdate: String!) {
        createPost(input: {
            poster: $poster
            content: $content
            image: $image
            video: $video
            postdate: $postdate
        }) {
            id
            poster
            content
            image
            video
            postdate
            liker
        }
    }
`

export const SET_POST = gql `
    mutation setpost($poster: ID!, $content: String!, $image: String!, $video: String!, $id: ID!) {
        setPost(input: {
            id: $id
            poster: $poster
            content: $content
            image: $image
            video: $video
        }) {
            id
            poster
            content
            image
            video
            postdate
            liker
        }
    }
`

export const DEL_POST = gql `
    mutation delpost($id: ID!){
        deletePost(id: $id) {
        id
        poster
        content
        image
        video
        postdate
        liker
        }
    }
`

export const TOGGLE_LIKE_POST = gql `
    mutation togglelike($id: ID!, $liker: ID!) {
    toggleLike(input: {
        id: $id,
        liker: $liker
    }) {
        id
        poster
        content
        image
        video
        postdate
        liker
    }
    }
`

// COMMENTS

export const GET_COMMENTS = gql `
    query allComm{
    Comment{
        id
        parentPost
        parentComment
        commenter
        content
        postdate
        liker
    }
    }
`
export const GET_COMMENT_ID = gql `
    query commid($id: ID!){
        CommentbyID(id: $id) {
        id
        parentPost
        parentComment
        commenter
        content
        postdate
        liker
        }
    }
`

export const GET_COMMENTS_POST = gql `
    query commbypostid($parentPost: ID!){
        CommentsbyPost(parentPost: $parentPost) {
        id
        parentPost
        parentComment
        commenter
        content
        postdate
        liker
        }
    }
`

export const NEW_COMMENT = gql `
    mutation newcomm($parentPost: ID!, $parentComment: ID!, $commenter: ID!, $content: String!, $postdate: String!) {
    createComment(input: {
        parentPost: $parentPost 
        parentComment: $parentComment 
        commenter: $commenter 
        content: $content
        postdate: $postdate
    }) {
        id
        parentPost
        parentComment
        commenter
        content
        postdate
        liker
    }
    }
`

export const TOGGLE_LIKE_COMMENT = gql `
    mutation togglelikecomment($id: ID!, $liker: ID!) {
    toggleLikeComment(input: {
        id: $id,
        liker: $liker
    }) {
        id
        parentPost
        parentComment
        commenter
        content
        postdate
        liker
    }
    }
`

// JOBS
export const GET_JOBS = gql `
    query allJobs{
        Job{
            id
            poster
            title
            company
            location
            employment
            description
        }
    }
`

export const ADD_JOB = gql`
    mutation newjobpost($poster: ID!, $title: String!, $company: String!, $location: String!, $employment: String!, $description: String!) {
    createJob(input: {
        poster: $poster
        title: $title
        company: $company
        location: $location
        employment: $employment
        description: $description
    }) {
        id
        poster
        title
        company
        location
        employment
        description
    }
    }
`