import { useState, type ChangeEvent, type FormEvent } from 'react';
import Modal from '../components/common/Modal';
import { useProductStore } from '../stores/productStore';
import { CATEGORIES, type Product, type ProductInput } from '../types/product';

interface Props {
  /** 수정할 상품. 없으면 '등록' 모드 */
  product?: Product;
  onClose: () => void;
}

type Errors = Partial<Record<'name' | 'price' | 'stock' | 'image', string>>;

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 400; // 저장할 이미지의 최대 가로·세로(px)

/**
 * 이미지를 최대 400px로 줄이고 JPEG로 압축해서 data URL로 돌려줌.
 * localStorage 용량(약 5MB)이 작아서 원본 그대로 저장하지 않음.
 */
function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#fff'; // 투명 PNG도 JPEG로 바꿀 때 배경이 검게 나오지 않게
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 읽을 수 없음'));
    };
    img.src = url;
  });
}

export default function ProductFormModal({ product, onClose }: Props) {
  const { addProduct, updateProduct } = useProductStore();
  const isEdit = Boolean(product);

  // 가격·재고는 입력 중 빈 값도 허용해야 해서 문자열로 관리하고, 저장할 때 숫자로 바꿈
  const [name, setName] = useState(product?.name ?? '');
  const [category, setCategory] = useState<ProductInput['category']>(product?.category ?? '전자제품');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [stock, setStock] = useState(product ? String(product.stock) : '');
  const [image, setImage] = useState<string | null>(product?.image ?? null);
  const [errors, setErrors] = useState<Errors>({});

  const clearError = (key: keyof Errors) => setErrors((e) => ({ ...e, [key]: undefined }));

  async function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // 같은 파일을 다시 골라도 동작하게 초기화
    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      setErrors((er) => ({ ...er, image: 'JPG, PNG, WEBP 파일만 올릴 수 있어요.' }));
      return;
    }
    try {
      setImage(await resizeImage(file));
      clearError('image');
    } catch {
      setErrors((er) => ({ ...er, image: '이미지를 읽을 수 없어요. 다른 파일을 골라 주세요.' }));
    }
  }

  /** 0 이상 정수인지 검사. 문제가 있으면 에러 문구를 돌려줌 */
  function checkNumber(value: string, emptyMsg: string) {
    if (value.trim() === '') return emptyMsg;
    const n = Number(value);
    if (!Number.isInteger(n) || n < 0) return '0 이상의 정수로 입력해 주세요.';
    return undefined;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found: Errors = {
      name: name.trim() ? undefined : '상품명을 입력해 주세요.',
      price: checkNumber(price, '가격을 입력해 주세요.'),
      stock: checkNumber(stock, '재고를 입력해 주세요.'),
      image: errors.image, // 이미지 에러는 파일 고를 때 이미 검사함
    };
    setErrors(found);
    if (Object.values(found).some(Boolean)) return; // 에러가 있으면 저장 안 함

    const input: ProductInput = {
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      image,
    };
    if (product) updateProduct(product.id, input);
    else addProduct(input);
    onClose();
  }

  return (
    <Modal title={isEdit ? '상품 수정' : '상품 등록'} onClose={onClose}>
      <form className="form" onSubmit={handleSubmit} noValidate>
        {/* 이미지 */}
        <div className="field">
          <span>상품 이미지</span>
          <div className="image-upload">
            <div className="image-preview">
              {image ? <img src={image} alt="미리보기" /> : <span className="thumb-empty">🖼</span>}
            </div>
            <div className="image-buttons">
              <label className="btn-sm">
                파일 선택
                <input type="file" accept={IMAGE_TYPES.join(',')} onChange={handleImage} hidden />
              </label>
              {image && (
                <button type="button" className="btn-sm danger" onClick={() => setImage(null)}>
                  이미지 삭제
                </button>
              )}
              <small className="muted">JPG · PNG · WEBP</small>
            </div>
          </div>
          {errors.image && <small className="error">{errors.image}</small>}
        </div>

        <label className="field">
          <span>상품명</span>
          <input
            className={`input ${errors.name ? 'invalid' : ''}`}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError('name');
            }}
            placeholder="무선 이어폰"
            autoFocus
          />
          {errors.name && <small className="error">{errors.name}</small>}
        </label>

        <label className="field">
          <span>카테고리</span>
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductInput['category'])}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <div className="field-row">
          <label className="field">
            <span>가격 (원)</span>
            <input
              className={`input ${errors.price ? 'invalid' : ''}`}
              type="number"
              min={0}
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                clearError('price');
              }}
              placeholder="89000"
            />
            {errors.price && <small className="error">{errors.price}</small>}
          </label>

          <label className="field">
            <span>재고</span>
            <input
              className={`input ${errors.stock ? 'invalid' : ''}`}
              type="number"
              min={0}
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
                clearError('stock');
              }}
              placeholder="100"
            />
            {errors.stock && <small className="error">{errors.stock}</small>}
          </label>
        </div>
        <small className="muted">재고가 0이면 자동으로 품절로 표시돼요.</small>

        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>
            취소
          </button>
          <button type="submit" className="btn-primary">
            {isEdit ? '저장' : '등록'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
