const tf = require('@tensorflow/tfjs');

class MovieRecommender {
    constructor(numUsers, numMovies, embeddingDim = 50) {
        this.model = tf.sequential();
        
        // User embedding
        this.model.add(tf.layers.embedding({
            inputDim: numUsers,
            outputDim: embeddingDim,
            inputLength: 1
        }));
        
        // Movie embedding
        this.model.add(tf.layers.embedding({
            inputDim: numMovies,
            outputDim: embeddingDim,
            inputLength: 1
        }));
        
        // Merge embeddings and add dense layers
        this.model.add(tf.layers.flatten());
        this.model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
        
        this.model.compile({
            optimizer: 'adam',
            loss: 'meanSquaredError'
        });
    }

    async train(userIds, movieIds, ratings, epochs = 50) {
        const xs = [tf.tensor2d(userIds, [userIds.length, 1]), 
                   tf.tensor2d(movieIds, [movieIds.length, 1])];
        const ys = tf.tensor2d(ratings, [ratings.length, 1]);
        
        await this.model.fit(xs, ys, {
            epochs: epochs,
            batchSize: 32
        });
    }

    predict(userId, movieId) {
        const prediction = this.model.predict([
            tf.tensor2d([userId], [1, 1]),
            tf.tensor2d([movieId], [1, 1])
        ]);
        return prediction.dataSync()[0];
    }
}

module.exports = MovieRecommender;
