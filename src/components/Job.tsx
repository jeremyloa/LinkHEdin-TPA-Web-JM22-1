export default function Job({job}){

    return(
        <div className="flex flex-col bg-white2 rounded-md py-3 my-2 w-full">
            <div className="pl-4">
                <h3 className="m-0">{job.title}</h3>
                <h4 className="m-0">{job.company} ● {job.location} ● {job.employment}</h4>
                <p>
                    {job.description}
                </p>
            </div>

        </div>
    )
}