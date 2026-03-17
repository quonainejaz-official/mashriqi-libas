'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import NextImage from 'next/image';
import {
  FaPlus,
  FaPen,
  FaTrash,
  FaCopy,
  FaFileCsv,
  FaFileExcel,
  FaChevronRight,
  FaChevronDown,
  FaGripVertical,
  FaSave,
  FaSpinner,
  FaImage,
  FaMagic,
  FaEye
} from 'react-icons/fa';

const initialForm = {
  mode: 'category',
  name: '',
  description: '',
  order: 1,
  status: true,
  parentRef: ''
};

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [dragInfo, setDragInfo] = useState(null);
  const [editingTarget, setEditingTarget] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [rawImage, setRawImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedDataUrl, setCroppedDataUrl] = useState('');
  const [cropSettings, setCropSettings] = useState({ zoom: 1, x: 50, y: 50 });
  const [draftStatus, setDraftStatus] = useState('');
  const [savedPreview, setSavedPreview] = useState(null);
  const [importing, setImporting] = useState(false);
  const importInputRef = useRef(null);
  const draftTimer = useRef(null);

  useEffect(() => {
    fetchCategories();
    const draft = localStorage.getItem('admin-category-draft');
    if (draft) {
      const parsed = JSON.parse(draft);
      setFormData((prev) => ({ ...prev, ...parsed }));
      setDraftStatus('Draft restored');
      setTimeout(() => setDraftStatus(''), 2000);
    }
  }, []);

  useEffect(() => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      localStorage.setItem('admin-category-draft', JSON.stringify(formData));
      setDraftStatus('Draft saved');
      setTimeout(() => setDraftStatus(''), 1500);
    }, 800);
    return () => clearTimeout(draftTimer.current);
  }, [formData]);

  useEffect(() => {
    if (!loading) {
      const next = new Set();
      categories.forEach((category) => next.add(getPathKey(category._id, [])));
      setExpandedNodes(next);
    }
  }, [loading, categories]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/admin/categories');
      setCategories(data.categories || []);
    } catch (err) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const slugify = (value) =>
    value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const getPathKey = (rootId, path) => `${rootId}:${path.join('.')}`;
  const serializeParentRef = (rootId, path) => `${rootId}::${path.join('.')}`;
  const parseParentRef = (value) => {
    if (!value) return null;
    const [rootId, pathString = ''] = value.split('::');
    const path = pathString ? pathString.split('.').map((entry) => Number(entry)) : [];
    return { rootId, path };
  };

  const validateForm = useCallback(
    (data) => {
      const nextErrors = {};
      if (!data.name.trim()) nextErrors.name = 'Name is required';
      if (data.name.trim().length < 2) nextErrors.name = 'Minimum 2 characters required';
      if (data.mode === 'subcategory' && !data.parentRef && !editingTarget) nextErrors.parentRef = 'Parent is required';
      if (data.order < 0) nextErrors.order = 'Order cannot be negative';
      if (data.description.length > 260) nextErrors.description = 'Max 260 characters allowed';
      return nextErrors;
    },
    [editingTarget]
  );

  useEffect(() => {
    setErrors(validateForm(formData));
  }, [formData, validateForm]);

  const updateChildrenByPath = (nodes, path, updater) => {
    if (path.length === 0) return updater(nodes);
    const [index, ...rest] = path;
    return nodes.map((node, idx) => {
      if (idx !== index) return node;
      return { ...node, subcategories: updateChildrenByPath(node.subcategories || [], rest, updater) };
    });
  };

  const updateNodeByPath = (nodes, path, updater) => {
    const [index, ...rest] = path;
    return nodes.map((node, idx) => {
      if (idx !== index) return node;
      if (rest.length === 0) return updater(node);
      return { ...node, subcategories: updateNodeByPath(node.subcategories || [], rest, updater) };
    });
  };

  const removeNodeByPath = (nodes, path) => {
    const [index, ...rest] = path;
    if (rest.length === 0) return nodes.filter((_, idx) => idx !== index);
    return nodes.map((node, idx) => {
      if (idx !== index) return node;
      return { ...node, subcategories: removeNodeByPath(node.subcategories || [], rest) };
    });
  };

  const reorderArray = (array, fromIndex, toIndex) => {
    const copy = [...array];
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);
    return copy;
  };

  const applyOrder = (nodes) =>
    nodes.map((node, index) => ({
      ...node,
      order: index + 1,
      subcategories: node.subcategories ? applyOrder(node.subcategories) : []
    }));

  const parentOptions = useMemo(() => {
    const options = [];
    categories.forEach((category) => {
      options.push({
        value: serializeParentRef(category._id, []),
        label: category.name
      });
      const walk = (subs, rootId, depth, path) => {
        subs.forEach((sub, idx) => {
          const nextPath = [...path, idx];
          options.push({
            value: serializeParentRef(rootId, nextPath),
            label: `${'—'.repeat(depth)} ${sub.name}`.trim()
          });
          if (sub.subcategories?.length) walk(sub.subcategories, rootId, depth + 1, nextPath);
        });
      };
      if (category.subcategories?.length) walk(category.subcategories, category._id, 1, []);
    });
    return options;
  }, [categories]);

  const previewImageUrl = useMemo(() => {
    if (croppedImage) return URL.createObjectURL(croppedImage);
    if (rawImage) return URL.createObjectURL(rawImage);
    if (editingTarget?.type === 'category') {
      const category = categories.find((item) => item._id === editingTarget.rootId);
      return category?.image?.url || '';
    }
    if (editingTarget?.type === 'subcategory') {
      const category = categories.find((item) => item._id === editingTarget.rootId);
      const node = category ? getNodeByPath(category.subcategories || [], editingTarget.path) : null;
      return node?.image?.url || '';
    }
    return '';
  }, [croppedImage, rawImage, editingTarget, categories]);

  const getNodeByPath = (nodes, path) => {
    let current = null;
    let list = nodes;
    for (const index of path) {
      current = list[index];
      if (!current) return null;
      list = current.subcategories || [];
    }
    return current;
  };

  const livePreview = useMemo(() => {
    const parentInfo = parseParentRef(formData.parentRef);
    let parentName = 'No parent selected';
    if (parentInfo) {
      const category = categories.find((item) => item._id === parentInfo.rootId);
      if (category) {
        parentName = category.name;
        if (parentInfo.path.length > 0) {
          const node = getNodeByPath(category.subcategories || [], parentInfo.path);
          if (node) parentName = `${category.name} / ${node.name}`;
        }
      }
    }
    return {
      name: formData.name || 'Untitled',
      description: formData.description || 'Description pending',
      status: formData.status,
      order: formData.order || 0,
      mode: formData.mode,
      parentName,
      image: previewImageUrl
    };
  }, [formData, previewImageUrl, categories]);

  const startEditCategory = (category) => {
    setEditingTarget({ type: 'category', rootId: category._id, path: [] });
    setFormData({
      mode: 'category',
      name: category.name || '',
      description: category.description || '',
      order: category.order || 1,
      status: category.isActive !== false,
      parentRef: ''
    });
    setRawImage(null);
    setCroppedImage(null);
    setCroppedDataUrl('');
  };

  const startEditSubcategory = (rootId, path) => {
    const category = categories.find((item) => item._id === rootId);
    const node = category ? getNodeByPath(category.subcategories || [], path) : null;
    if (!node) return;
    setEditingTarget({ type: 'subcategory', rootId, path });
    setFormData({
      mode: 'subcategory',
      name: node.name || '',
      description: node.description || '',
      order: node.order || 1,
      status: node.isActive !== false,
      parentRef: serializeParentRef(rootId, path.slice(0, -1))
    });
    setRawImage(null);
    setCroppedImage(null);
    setCroppedDataUrl('');
  };

  const resetForm = () => {
    setEditingTarget(null);
    setFormData(initialForm);
    setRawImage(null);
    setCroppedImage(null);
    setCroppedDataUrl('');
    setErrors({});
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    const loadingToast = toast.loading('Deleting category...');
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      toast.success('Category deleted', { id: loadingToast });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed', { id: loadingToast });
    }
  };

  const handleDeleteSubcategory = async (rootId, path) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
    const category = categories.find((item) => item._id === rootId);
    if (!category) return;
    const updatedSubcategories = removeNodeByPath(category.subcategories || [], path);
    const data = buildCategoryFormData(category, updatedSubcategories);
    const loadingToast = toast.loading('Deleting subcategory...');
    try {
      await axios.put(`/api/admin/categories/${rootId}`, data);
      toast.success('Subcategory deleted', { id: loadingToast });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed', { id: loadingToast });
    }
  };

  const buildCategoryFormData = (category, subcategories) => {
    const data = new FormData();
    data.append('name', category.name);
    data.append('description', category.description || '');
    data.append('order', category.order || 0);
    data.append('isActive', category.isActive !== false);
    data.append('subcategories', JSON.stringify(subcategories || []));
    return data;
  };

  const handleCloneCategory = async (category) => {
    const loadingToast = toast.loading('Cloning category...');
    try {
      const data = new FormData();
      data.append('name', `${category.name} Copy`);
      data.append('description', category.description || '');
      data.append('order', category.order || 0);
      data.append('isActive', category.isActive !== false);
      data.append('subcategories', JSON.stringify(category.subcategories || []));
      await axios.post('/api/admin/categories', data);
      toast.success('Category cloned', { id: loadingToast });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Clone failed', { id: loadingToast });
    }
  };

  const handleCloneSubcategory = async (rootId, path) => {
    const category = categories.find((item) => item._id === rootId);
    const node = category ? getNodeByPath(category.subcategories || [], path) : null;
    if (!category || !node) return;
    const parentPath = path.slice(0, -1);
    const clone = {
      ...node,
      name: `${node.name} Copy`,
      slug: slugify(`${node.name}-copy`)
    };
    const updatedSubcategories = updateChildrenByPath(category.subcategories || [], parentPath, (children) => [
      ...children,
      clone
    ]);
    const data = buildCategoryFormData(category, applyOrder(updatedSubcategories));
    const loadingToast = toast.loading('Cloning subcategory...');
    try {
      await axios.put(`/api/admin/categories/${rootId}`, data);
      toast.success('Subcategory cloned', { id: loadingToast });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Clone failed', { id: loadingToast });
    }
  };

  const handleSubmit = async () => {
    const validation = validateForm(formData);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      toast.error('Please fix validation errors');
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading(editingTarget ? 'Saving changes...' : 'Saving category...');
    try {
      if (formData.mode === 'category') {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('order', formData.order);
        data.append('isActive', formData.status);
        if (croppedImage) {
          data.append('image', croppedImage);
        }
        if (editingTarget?.type === 'category') {
          await axios.put(`/api/admin/categories/${editingTarget.rootId}`, data);
        } else {
          await axios.post('/api/admin/categories', data);
        }
      } else {
        const parentInfo = editingTarget?.type === 'subcategory' ? editingTarget : parseParentRef(formData.parentRef);
        if (!parentInfo) {
          toast.error('Please select a parent', { id: loadingToast });
          setSaving(false);
          return;
        }
        const category = categories.find((item) => item._id === parentInfo.rootId);
        if (!category) {
          toast.error('Parent category not found', { id: loadingToast });
          setSaving(false);
          return;
        }
        const newNode = {
          name: formData.name,
          slug: slugify(formData.name),
          description: formData.description,
          order: formData.order,
          isActive: formData.status,
          subcategories: [],
          imageData: croppedDataUrl
        };
        const updatedSubcategories =
          editingTarget?.type === 'subcategory'
            ? updateNodeByPath(category.subcategories || [], editingTarget.path, (node) => ({
                ...node,
                ...newNode,
                imageData: croppedDataUrl || node.imageData,
                image: croppedDataUrl ? node.image : node.image
              }))
            : updateChildrenByPath(category.subcategories || [], parentInfo.path || [], (children) => [
                ...children,
                newNode
              ]);
        const ordered = applyOrder(updatedSubcategories);
        const data = buildCategoryFormData(category, ordered);
        await axios.put(`/api/admin/categories/${parentInfo.rootId}`, data);
      }
      toast.success('Saved successfully', { id: loadingToast });
      setSavedPreview(livePreview);
      localStorage.removeItem('admin-category-draft');
      resetForm();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed', { id: loadingToast });
  } finally {
    setSaving(false);
  }
};

  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  });

  const toggleExpand = (rootId, path) => {
    const key = getPathKey(rootId, path);
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const samePath = (a = [], b = []) => a.length === b.length && a.every((val, idx) => val === b[idx]);

  const handleDragStart = (payload) => setDragInfo(payload);
  const handleDrop = (payload) => {
    if (!dragInfo) return;
    if (payload.type !== dragInfo.type) return;
    if (payload.type === 'category') {
      const updated = reorderArray(categories, dragInfo.index, payload.index).map((cat, idx) => ({
        ...cat,
        order: idx + 1
      }));
      setCategories(updated);
      setOrderDirty(true);
      setDragInfo(null);
      return;
    }
    if (payload.rootId !== dragInfo.rootId || !samePath(payload.parentPath, dragInfo.parentPath)) {
      toast.error('Reorder is limited to the same parent');
      setDragInfo(null);
      return;
    }
    const category = categories.find((item) => item._id === payload.rootId);
    if (!category) return;
    const updatedSubcategories = updateChildrenByPath(category.subcategories || [], payload.parentPath, (children) =>
      reorderArray(children, dragInfo.index, payload.index).map((node, idx) => ({ ...node, order: idx + 1 }))
    );
    const updatedCategories = categories.map((item) =>
      item._id === payload.rootId ? { ...item, subcategories: updatedSubcategories } : item
    );
    setCategories(updatedCategories);
    setOrderDirty(true);
    setDragInfo(null);
  };

  const handleSaveOrder = async () => {
    if (!orderDirty) return;
    setSaving(true);
    const loadingToast = toast.loading('Saving order...');
    try {
      await Promise.all(
        categories.map((category) => {
          const data = buildCategoryFormData(category, category.subcategories || []);
          return axios.put(`/api/admin/categories/${category._id}`, data);
        })
      );
      toast.success('Order saved', { id: loadingToast });
      setOrderDirty(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Order save failed', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handleCropApply = async () => {
    if (!rawImage) return;
    const result = await createCroppedImage(rawImage, cropSettings);
    setCroppedImage(result.file);
    setCroppedDataUrl(result.dataUrl);
    toast.success('Image cropped & optimized');
  };

  const createCroppedImage = (file, settings) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const outputSize = 800;
        canvas.width = outputSize;
        canvas.height = outputSize;
        const ctx = canvas.getContext('2d');
        const scale = settings.zoom;
        const sourceWidth = img.width / scale;
        const sourceHeight = img.height / scale;
        const centerX = (settings.x / 100) * img.width;
        const centerY = (settings.y / 100) * img.height;
        const sx = Math.max(0, Math.min(img.width - sourceWidth, centerX - sourceWidth / 2));
        const sy = Math.max(0, Math.min(img.height - sourceHeight, centerY - sourceHeight / 2));
        ctx.drawImage(img, sx, sy, sourceWidth, sourceHeight, 0, 0, outputSize, outputSize);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Image processing failed'));
            const optimizedFile = new File([blob], file.name, { type: 'image/jpeg' });
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve({ file: optimizedFile, dataUrl });
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });

  const escapeCsvValue = (value) => {
    const str = `${value ?? ''}`;
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const flattenForExport = () => {
    const rows = [];
    categories.forEach((category) => {
      rows.push({
        type: 'category',
        name: category.name,
        parent: '',
        order: category.order || 0,
        status: category.isActive !== false ? 'active' : 'hidden',
        description: category.description || ''
      });
      const walk = (subs, parents) => {
        subs.forEach((sub) => {
          rows.push({
            type: 'subcategory',
            name: sub.name,
            parent: parents.join(' / '),
            order: sub.order || 0,
            status: sub.isActive !== false ? 'active' : 'hidden',
            description: sub.description || ''
          });
          if (sub.subcategories?.length) walk(sub.subcategories, [...parents, sub.name]);
        });
      };
      walk(category.subcategories || [], [category.name]);
    });
    return rows;
  };

  const handleExportCsv = () => {
    const rows = flattenForExport();
    const header = ['type', 'name', 'parent', 'order', 'status', 'description'];
    const csv = [header.join(',')]
      .concat(rows.map((row) => header.map((key) => escapeCsvValue(row[key])).join(',')))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'categories.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    const rows = flattenForExport();
    const header = ['type', 'name', 'parent', 'order', 'status', 'description'];
    const table = `
      <table>
        <tr>${header.map((item) => `<th>${item}</th>`).join('')}</tr>
        ${rows
          .map(
            (row) =>
              `<tr>${header.map((key) => `<td>${escapeCsvValue(row[key])}</td>`).join('')}</tr>`
          )
          .join('')}
      </table>
    `;
    const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'categories.xls';
    link.click();
    URL.revokeObjectURL(url);
  };

  const parseCsv = (text) => {
    const rows = [];
    let current = [];
    let value = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];
      if (char === '"' && inQuotes && next === '"') {
        value += '"';
        i += 1;
        continue;
      }
      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (char === ',' && !inQuotes) {
        current.push(value);
        value = '';
        continue;
      }
      if ((char === '\n' || char === '\r') && !inQuotes) {
        if (value || current.length > 0) {
          current.push(value);
          rows.push(current);
          current = [];
          value = '';
        }
        continue;
      }
      value += char;
    }
    if (value || current.length > 0) {
      current.push(value);
      rows.push(current);
    }
    return rows;
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const text = await file.text();
    const rows = parseCsv(text);
    const [header, ...dataRows] = rows;
    if (!header) {
      toast.error('Invalid CSV file');
      setImporting(false);
      return;
    }
    const indexMap = header.reduce((acc, key, idx) => ({ ...acc, [key.trim()]: idx }), {});
    const importedCategories = [];
    const getOrCreateCategory = (name) => {
      let category = importedCategories.find((item) => item.name === name);
      if (!category) {
        category = {
          name,
          description: '',
          order: importedCategories.length + 1,
          isActive: true,
          subcategories: []
        };
        importedCategories.push(category);
      }
      return category;
    };
    const insertSubcategory = (parentNode, nodeName, row) => {
      let node = parentNode.subcategories.find((item) => item.name === nodeName);
      if (!node) {
        node = {
          name: nodeName,
          description: row.description || '',
          order: Number(row.order) || parentNode.subcategories.length + 1,
          isActive: row.status !== 'hidden',
          subcategories: []
        };
        parentNode.subcategories.push(node);
      }
      return node;
    };
    dataRows.forEach((row) => {
      const rowData = {
        type: row[indexMap.type] || 'category',
        name: row[indexMap.name] || '',
        parent: row[indexMap.parent] || '',
        order: row[indexMap.order] || 0,
        status: row[indexMap.status] || 'active',
        description: row[indexMap.description] || ''
      };
      if (!rowData.name.trim()) return;
      if (rowData.type === 'category' || !rowData.parent) {
        const category = getOrCreateCategory(rowData.name);
        category.description = rowData.description || category.description;
        category.order = Number(rowData.order) || category.order;
        category.isActive = rowData.status !== 'hidden';
        return;
      }
      const path = rowData.parent.split('/').map((part) => part.trim()).filter(Boolean);
      if (!path.length) return;
      const category = getOrCreateCategory(path[0]);
      let current = category;
      path.slice(1).forEach((segment) => {
        current = insertSubcategory(current, segment, rowData);
      });
      insertSubcategory(current, rowData.name, rowData);
    });

    const loadingToast = toast.loading('Importing categories...');
    try {
      await Promise.all(
        importedCategories.map((category) => {
          const data = new FormData();
          data.append('name', category.name);
          data.append('description', category.description || '');
          data.append('order', category.order || 0);
          data.append('isActive', category.isActive !== false);
          data.append('subcategories', JSON.stringify(category.subcategories || []));
          return axios.post('/api/admin/categories', data);
        })
      );
      toast.success('Import completed', { id: loadingToast });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Import failed', { id: loadingToast });
    } finally {
      setImporting(false);
      if (importInputRef.current) importInputRef.current.value = '';
    }
  };

  const renderSubcategoryNodes = (nodes, rootId, parentPath = [], depth = 0) =>
    nodes.map((node, index) => {
      const path = [...parentPath, index];
      const key = getPathKey(rootId, path);
      const isExpanded = expandedNodes.has(key);
      const hasChildren = node.subcategories?.length > 0;
      return (
        <div key={key} className="space-y-2">
          <div
            className="flex items-center justify-between gap-3 border border-gray-100 rounded-md px-3 py-2"
            draggable
            onDragStart={() => handleDragStart({ type: 'subcategory', rootId, parentPath, index })}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop({ type: 'subcategory', rootId, parentPath, index })}
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleExpand(rootId, path)}
                className={`text-gray-400 ${hasChildren ? 'visible' : 'invisible'}`}
              >
                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              </button>
              <FaGripVertical className="text-gray-300" />
              <span className="text-[10px] uppercase tracking-widest text-[#2C3E50] font-bold">
                {node.name}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400">Order {node.order || 0}</span>
              <span
                className={`text-[9px] uppercase tracking-widest ${
                  node.isActive !== false ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                {node.isActive !== false ? 'Active' : 'Hidden'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEditSubcategory(rootId, path)} className="text-[#2C3E50] hover:text-[#A08C5B]">
                <FaPen />
              </button>
              <button onClick={() => handleCloneSubcategory(rootId, path)} className="text-[#2C3E50] hover:text-[#A08C5B]">
                <FaCopy />
              </button>
              <button onClick={() => handleDeleteSubcategory(rootId, path)} className="text-red-500 hover:text-red-600">
                <FaTrash />
              </button>
            </div>
          </div>
          {hasChildren && isExpanded && (
            <div className="pl-6 space-y-2">{renderSubcategoryNodes(node.subcategories || [], rootId, path, depth + 1)}</div>
          )}
        </div>
      );
    });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-[#2C3E50]">Category CMS</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Professional admin category management</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExportCsv} className="h-11 px-4 border border-gray-200 text-[11px] uppercase tracking-widest flex items-center gap-2">
            <FaFileCsv /> Export CSV
          </button>
          <button onClick={handleExportExcel} className="h-11 px-4 border border-gray-200 text-[11px] uppercase tracking-widest flex items-center gap-2">
            <FaFileExcel /> Export Excel
          </button>
          <input ref={importInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
          <button
            onClick={() => importInputRef.current?.click()}
            className="h-11 px-4 border border-gray-200 text-[11px] uppercase tracking-widest flex items-center gap-2"
            disabled={importing}
          >
            {importing ? <FaSpinner className="animate-spin" /> : <FaPlus />} Import CSV
          </button>
          <button onClick={resetForm} className="btn-primary h-11 px-5 flex items-center gap-2 text-[11px]">
            <FaPlus /> New Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2C3E50] font-bold">Category Form</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Auto-save draft · Ctrl+S to save</p>
            </div>
            {draftStatus && <span className="text-[10px] uppercase tracking-widest text-gray-400">{draftStatus}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
              />
              {errors.name && <p className="text-[10px] uppercase tracking-widest text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Type</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData((prev) => ({ ...prev, mode: e.target.value }))}
                disabled={editingTarget}
                className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none disabled:opacity-60"
              >
                <option value="category">Category</option>
                <option value="subcategory">Subcategory</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Parent</label>
              <select
                value={formData.parentRef}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentRef: e.target.value }))}
                disabled={formData.mode === 'category' || editingTarget}
                className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none disabled:opacity-60"
              >
                <option value="">Select parent</option>
                {parentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.parentRef && <p className="text-[10px] uppercase tracking-widest text-red-500">{errors.parentRef}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Display Order</label>
              <input
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData((prev) => ({ ...prev, order: Number(e.target.value) }))}
                className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
              />
              {errors.order && <p className="text-[10px] uppercase tracking-widest text-red-500">{errors.order}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-50 border-none p-4 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none resize-none"
            />
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
              <span className="text-gray-400">{formData.description.length}/260</span>
              {errors.description && <span className="text-red-500">{errors.description}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</label>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status: !prev.status }))}
                className={`w-full flex items-center justify-between p-4 text-sm uppercase tracking-widest ${formData.status ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}
              >
                {formData.status ? 'Active' : 'Hidden'}
                <span className="text-[10px]">Toggle</span>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Image Upload</label>
              <div className="relative border-2 border-dashed p-4 text-center cursor-pointer hover:border-[#A08C5B]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setRawImage(file || null);
                    setCroppedImage(null);
                    setCroppedDataUrl('');
                    setCropSettings({ zoom: 1, x: 50, y: 50 });
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  <FaImage />
                  {rawImage ? rawImage.name : 'Upload & Crop'}
                </div>
              </div>
            </div>
          </div>

          {rawImage && (
            <div className="border border-gray-100 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400">
                <FaMagic /> Crop & Optimize
              </div>
              <div className="relative h-48 bg-gray-50 flex items-center justify-center">
                {previewImageUrl ? (
                  <NextImage
                    src={previewImageUrl}
                    alt="Crop preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    unoptimized
                  />
                ) : (
                  <div className="text-[10px] uppercase tracking-widest text-gray-400">Preview</div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 text-[10px] uppercase tracking-widest text-gray-400">
                <label className="flex flex-col gap-1">
                  Zoom
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.1"
                    value={cropSettings.zoom}
                    onChange={(e) => setCropSettings((prev) => ({ ...prev, zoom: Number(e.target.value) }))}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  X
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={cropSettings.x}
                    onChange={(e) => setCropSettings((prev) => ({ ...prev, x: Number(e.target.value) }))}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Y
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={cropSettings.y}
                    onChange={(e) => setCropSettings((prev) => ({ ...prev, y: Number(e.target.value) }))}
                  />
                </label>
              </div>
              <button type="button" onClick={handleCropApply} className="w-full border border-gray-200 py-2 text-[10px] uppercase tracking-widest">
                Apply Crop
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary h-12 flex-1 flex items-center justify-center gap-2 text-[11px]"
              disabled={saving}
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {editingTarget ? 'Save Changes' : 'Save & Preview'}
            </button>
            <button type="button" onClick={resetForm} className="h-12 flex-1 border border-gray-200 text-[11px] uppercase tracking-widest">
              Reset Form
            </button>
          </div>
        </section>

        <aside className="bg-white border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#2C3E50] font-bold">
            <FaEye /> Live Preview
          </div>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="relative h-48 bg-gray-50 flex items-center justify-center">
              {livePreview.image ? (
                <NextImage
                  src={livePreview.image}
                  alt={livePreview.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  unoptimized
                />
              ) : (
                <div className="text-[10px] uppercase tracking-widest text-gray-400">No image selected</div>
              )}
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#2C3E50]">{livePreview.name}</h3>
                <span className="text-[9px] uppercase tracking-widest bg-gray-100 px-2 py-1">Order {livePreview.order}</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                {livePreview.mode === 'category' ? 'Category' : `Subcategory · ${livePreview.parentName}`}
              </p>
              <p className="text-xs text-gray-500">{livePreview.description}</p>
              <span className={`text-[9px] uppercase tracking-widest ${livePreview.status ? 'text-emerald-600' : 'text-gray-400'}`}>
                {livePreview.status ? 'Active' : 'Hidden'}
              </span>
            </div>
          </div>
          {savedPreview && (
            <div className="border border-[#A08C5B] rounded-lg overflow-hidden">
              <div className="bg-[#A08C5B] text-white text-[10px] uppercase tracking-widest px-4 py-2">
                Submitted Preview
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2C3E50]">{savedPreview.name}</span>
                  <span className="text-[9px] uppercase tracking-widest bg-gray-100 px-2 py-1">Order {savedPreview.order}</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">
                  {savedPreview.mode === 'category' ? 'Category' : `Subcategory · ${savedPreview.parentName}`}
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>

      <section className="bg-white border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#2C3E50] font-bold">Category Tree</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Expand/collapse · Drag to reorder · Clone</p>
          </div>
          <button
            onClick={handleSaveOrder}
            className="h-11 px-5 border border-gray-200 text-[11px] uppercase tracking-widest flex items-center gap-2"
            disabled={!orderDirty || saving}
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            Save Order
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 animate-pulse rounded"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category, index) => {
              const key = getPathKey(category._id, []);
              const isExpanded = expandedNodes.has(key);
              return (
                <div key={category._id} className="border border-gray-100 rounded-lg p-4 space-y-4">
                  <div
                    className="flex items-center justify-between gap-3"
                    draggable
                    onDragStart={() => handleDragStart({ type: 'category', index })}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop({ type: 'category', index })}
                  >
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => toggleExpand(category._id, [])} className="text-gray-400">
                        {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                      </button>
                      <FaGripVertical className="text-gray-300" />
                      <span className="text-[11px] uppercase tracking-widest text-[#2C3E50] font-bold">{category.name}</span>
                      <span className="text-[9px] uppercase tracking-widest text-gray-400">Order {category.order || 0}</span>
                      <span className={`text-[9px] uppercase tracking-widest ${category.isActive !== false ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {category.isActive !== false ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEditCategory(category)} className="text-[#2C3E50] hover:text-[#A08C5B]">
                        <FaPen />
                      </button>
                      <button onClick={() => handleCloneCategory(category)} className="text-[#2C3E50] hover:text-[#A08C5B]">
                        <FaCopy />
                      </button>
                      <button onClick={() => handleDeleteCategory(category._id)} className="text-red-500 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  {category.subcategories?.length > 0 && isExpanded && (
                    <div className="pl-4 space-y-3">
                      {renderSubcategoryNodes(category.subcategories || [], category._id, [])}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminCategoriesPage;
