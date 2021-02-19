import React from 'react';

const styles = {
    card: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
};

function SimpleMediaCard(props) {
    const { classes } = props;
    return (
        <div>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.media}
                    image="./images/algorand_logo_mark_black.png"
                    title="Algorand Logo"
                />
            </Card>
        </div>
    );
}

export default withStyles(styles)(SimpleMediaCard);