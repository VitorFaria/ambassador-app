import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/product.entity";

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