import React, { useState } from "react";
import toast from "react-hot-toast";
import CategoryApi from "../../apis/category.api";

const categoriesService = new CategoryApi();

interface Props {
    category?: any;
    onClose: () => void;
    onSuccess: (newCategory: any) => void;
}

const CategoryModal: React.FC<Props> = ({
    category,
    onClose,
    onSuccess,
}) => {
    const [form, setForm] = useState({
        name: category?.name || "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const payload = {
                name: form.name,
            };

            let res;

            if (category?.id) {
                res = await categoriesService.updateCategory(payload, category.id);
            } else {
                res = await categoriesService.createCategory(payload);
            }

            if (res?.status === 200 || res?.status === 201) {
                toast.success(
                    category
                        ? "Category updated successfully"
                        : "Category created successfully"
                );

                onSuccess(res.data.data);

                onClose();
            } else {
                toast.error(res?.data?.message || "Operation failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-md">

                {/* Header */}
                <div className="bg-[#ffe600] border-b-4 border-black px-6 py-4 flex justify-between items-center">
                    <h2 className="font-black uppercase text-lg">
                        {category ? "Edit Category" : "Add New Category"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-2xl font-black"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Category Name */}
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm uppercase">
                            Category Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter category name"
                            className="border-2 border-black px-3 py-3 outline-none shadow-[4px_4px_0px_#000]"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    {/* <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm uppercase">
                            Description
                        </label>

                        <textarea
                            rows={4}
                            placeholder="Enter category description"
                            className="border-2 border-black px-3 py-3 outline-none shadow-[4px_4px_0px_#000] resize-none"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            required
                        />
                    </div> */}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#ffe600] border-4 border-black py-3 font-black uppercase shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                        {loading
                            ? "Saving..."
                            : category
                                ? "Update Category"
                                : "Save Category"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;