import tf from '@tensorflow/tfjs-node';

class MovieRecommender {
    private model: tf.LayersModel;

    constructor(numUsers: number, numMovies: number, embeddingDim = 50) {
        // Create input layers
        const userInput = tf.input({shape: [1]});
        const movieInput = tf.input({shape: [1]});

        // Create embedding layers
        const userEmbedding = tf.layers.embedding({
            inputDim: numUsers,
            outputDim: embeddingDim
        }).apply(userInput);

        const movieEmbedding = tf.layers.embedding({
            inputDim: numMovies,
            outputDim: embeddingDim
        }).apply(movieInput);

        // Flatten embeddings
        const userFlat = tf.layers.flatten().apply(userEmbedding) as tf.SymbolicTensor;
        const movieFlat = tf.layers.flatten().apply(movieEmbedding) as tf.SymbolicTensor;

        // Concatenate embeddings
        const concat = tf.layers.concatenate().apply([userFlat, movieFlat]);

        // Add dense layers
        const dense = tf.layers.dense({units: 1, activation: 'sigmoid'}).apply(concat) as tf.SymbolicTensor;

        // Create model
        this.model = tf.model({
            inputs: [userInput, movieInput],
            outputs: dense
        });

        this.model.compile({
            optimizer: 'adam',
            loss: 'meanSquaredError'
        });
    }

    async train(userIds: number[], movieIds: number[], ratings: number[], epochs = 50) {
        const xs = [tf.tensor2d(userIds, [userIds.length, 1]), 
                   tf.tensor2d(movieIds, [movieIds.length, 1])];
        const ys = tf.tensor2d(ratings, [ratings.length, 1]);
        
        await this.model.fit(xs, ys, {
            epochs: epochs,
            batchSize: 32
        });
    }

    predict(userId: number, movieId: number): number {
        return tf.tidy(() => {
            const prediction = this.model.predict([
                tf.tensor2d([userId], [1, 1]),
                tf.tensor2d([movieId], [1, 1])
            ]) as tf.Tensor;
            return prediction.dataSync()[0];
        });
    }

    async saveModel(path: string) {
        await this.model.save(`file://${path}`);
    }

    async loadModel(path: string) {
        this.model = tf.sequential({ layers: (await tf.loadLayersModel(`file://${path}`)).layers });
    }
}

export { MovieRecommender };