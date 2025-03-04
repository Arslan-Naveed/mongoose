const Product = require('../models/Product')
const User = require('../models/User')

exports.insertProduct = async (req,res)=>{
    const {name, price, countInStock} = req.body
    
    if (!name || !price || !countInStock) {
        return res.status(400).json({ error: 'Name, price, and countInStock are required' });
    }

    try {
        const product = new Product({ name, price, countInStock });
        const savedProduct = await product.save();
        res.status(201).json({ message: 'Product created successfully', product: savedProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllProducts = async (req,res)=>{   
    try {
        const products = await Product.find( {}, { __v: 0 } );
        res.status(200).json({products})
    } catch (error) {
        res.status(400).json({error:error.message})
    }   
 };

 exports.toggleSavedProduct = async (req, res) => {
    const { productId, userId } = req.body;
    
    if (!productId || !userId) {
        return res.status(400).json({ error: 'Product ID and User ID are required' });
    }

    try {
        const [product, user] = await Promise.all([
            Product.findById(productId),
            User.findById(userId)
        ]);

        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isSaved = user.savedProducts.includes(productId);
        const updateMethod = isSaved ? 'pull' : 'push';
        
        user.savedProducts[updateMethod](productId);
        await user.save();
        
        res.json({
            message: `Product ${isSaved ? 'removed' : 'added'} successfully`,
            product
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

 exports.getSavedProducts = async (req,res) =>{
   
    const {userId}= req.body;
    try {
        const user  =await User.findById(userId).populate('savedProducts');
        if(!user) return res.status(404).json({error:'User not found'})
        res.json({products:user.savedProducts});
    } catch (error) {
        res.status(400).json({error:error.message})
    }
 }

 exports.getAllProductsWithSavedFlag = async (req, res) => {
    const { userId, page = 1, limit = 10 } = req.body; 
    
    try {
        const [products, user] = await Promise.all([
            Product.find()
                .skip((page - 1) * limit)
                .limit(parseInt(limit)),
            User.findById(userId)
        ]);

        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!products.length) return res.status(200).json({ products: [] });

        const productsWithFlag = products.map(product => ({
            ...product.toObject(),
            isSaved: user.savedProducts.includes(product._id)
        }));

        res.json({ products: productsWithFlag });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


  exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);   
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }    
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
