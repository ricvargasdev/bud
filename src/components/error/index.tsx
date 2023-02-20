type Props = {
    objectName: string
}

export const Error = ({objectName}: Props) => <div style={{color: 'red'}}>An error has occured when fetching {objectName}</div>;
