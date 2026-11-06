import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/product.entity";
import { redisClient } from "..";

export const Products = async (req: Request, res: Response) => {
  res.send(await AppDataSource.getRepository(Product).find());
}

export const CreateProduct = async (req: Request, res: Response) => {
  const product = await AppDataSource.getRepository(Product).save(req.body);

  res.status(201).send(product);
}

export const GetProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await AppDataSource.getRepository(Product).findOneBy({ id });

  if (!product) return res.status(404).json({ message: "Product not found" });

  res.send(await AppDataSource.getRepository(Product).findOneBy({ id }));
}

export const UpdateProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const repository = AppDataSource.getRepository(Product);

  await repository.update(id, req.body);

  res.status(202).send(await repository.findOneBy({ id }));
}

export const DeleteProduct = async (req: Request, res: Response) => {
  await AppDataSource.getRepository(Product).delete(req.params.id);

  res.status(204).send(null);
}

export const ProductsFrontend = async (req: Request, res: Response) => {
  const cachedProducts = await redisClient.get("products_frontend");

  let products;
  if (cachedProducts) {
    products = JSON.parse(cachedProducts);
  }
  else {
    products = await AppDataSource.getRepository(Product).find();
  
    await redisClient.set("products_frontend", JSON.stringify(products), {
      EX: 1800 // 30min
    });
  }

  res.send(products);
}

export const ProductsBackend = async (req: Request, res: Response) => {
  const cachedProducts = await redisClient.get("products_frontend");

  let products;
  if (cachedProducts) {
    products = JSON.parse(cachedProducts);
  }
  else {
    products = await AppDataSource.getRepository(Product).find();
  
    await redisClient.set("products_frontend", JSON.stringify(products), {
      EX: 1800 // 30min
    });
  }

  if (req.query.search) {
    const search = req.query.search.toString().toLowerCase();

    products = products.filter((product: Product) => {
      return product.title.toLowerCase().includes(search) 
      || product.description.toLowerCase().includes(search);
    })
  }

  if (req.query.sort === 'asc' || req.query.sort === 'desc') {
    products = products.sort((a: Product, b: Product) => {
      const diff = a.price - b.price;
      if (diff === 0) return 0;

      const sign = Math.abs(diff) / diff;
      return req.query.sort === 'asc' ? sign : -sign;
    });
  }

  const page = req.query.page ? parseInt(req.query.page as any) : 1;
  const perPage = 9;
  const total = products.length;

  const data = products.slice((page - 1) * perPage, page * perPage);

  res.send({
    data,
    pagination: {
      total,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(total / perPage)
    }
  });
}