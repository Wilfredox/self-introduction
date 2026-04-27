import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { realApi } from "../data/realApi";
import { queryKeys, useAdminSiteQuery } from "../hooks/usePortfolioQueries";
import { ContactItem } from "../types/content";

function createEmptyContact(order: number): ContactItem {
  return {
    id: `contact-${Date.now()}-${order}`,
    label: "新联系方式",
    value: "",
    href: "",
    order
  };
}

function sortContacts(contacts: ContactItem[]) {
  return [...contacts].sort((left, right) => left.order - right.order);
}

function updateContactById(contacts: ContactItem[], contactId: string, updates: Partial<ContactItem>) {
  return contacts.map((contact) => (contact.id === contactId ? { ...contact, ...updates } : contact));
}

export function AdminProfilePage() {
  const queryClient = useQueryClient();
  const siteQuery = useAdminSiteQuery();
  const [form, setForm] = useState<{ name: string; tagline: string; contacts: ContactItem[] } | null>(null);

  useEffect(() => {
    if (siteQuery.data) {
      setForm({
        name: siteQuery.data.name,
        tagline: siteQuery.data.tagline,
        contacts: siteQuery.data.contacts
      });
    }
  }, [siteQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      realApi.updateAdminSite({
        name: form?.name ?? "",
        tagline: form?.tagline ?? "",
        contacts:
          sortContacts(form?.contacts ?? []).map((contact, index) => ({
            label: contact.label.trim(),
            value: contact.value.trim(),
            href: contact.href.trim(),
            order: (index + 1) * 100
          }))
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminSite });
      await queryClient.invalidateQueries({ queryKey: queryKeys.bootstrap });
    }
  });

  if (siteQuery.isLoading || !form) {
    if (siteQuery.error) {
      return <div className="state-shell">读取基本信息失败：{siteQuery.error.message}</div>;
    }

    return <div className="state-shell">正在载入基本信息...</div>;
  }

  const sortedContacts = sortContacts(form.contacts);

  return (
    <div className="admin-page-grid">
      <section className="admin-page-head">
        <p className="eyebrow">/admin/profile</p>
        <h1>基本信息维护</h1>
        <p className="muted">这里维护首页顶部姓名、一句话介绍和联系方式。保存成功后，公开页会按最新接口内容刷新展示。</p>
      </section>

      <section className="form-card">
        <label className="field">
          <span>姓名</span>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>

        <label className="field">
          <span>一句话介绍</span>
          <textarea
            value={form.tagline}
            onChange={(event) => setForm({ ...form, tagline: event.target.value })}
          />
        </label>

        <div className="form-group">
          <div className="form-group__head">
            <strong>联系方式</strong>
            <button
              className="ghost-button"
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  contacts: [...form.contacts, createEmptyContact(sortedContacts.length + 1)]
                })
              }
            >
              新增联系方式
            </button>
          </div>

          <div className="stack-panel">
            {sortedContacts.map((contact) => (
                <div key={contact.id} className="contact-row">
                  <input
                    value={contact.label}
                    onChange={(event) => {
                      setForm({
                        ...form,
                        contacts: updateContactById(form.contacts, contact.id, {
                          label: event.target.value
                        })
                      });
                    }}
                    placeholder="标签"
                  />
                  <input
                    value={contact.value}
                    onChange={(event) => {
                      setForm({
                        ...form,
                        contacts: updateContactById(form.contacts, contact.id, {
                          value: event.target.value
                        })
                      });
                    }}
                    placeholder="展示值"
                  />
                  <input
                    value={contact.href}
                    onChange={(event) => {
                      setForm({
                        ...form,
                        contacts: updateContactById(form.contacts, contact.id, {
                          href: event.target.value
                        })
                      });
                    }}
                    placeholder="链接"
                  />
                  <button
                    className="text-button"
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        contacts: sortContacts(form.contacts.filter((item) => item.id !== contact.id))
                          .map((item, itemIndex) => ({ ...item, order: itemIndex + 1 }))
                      })
                    }
                  >
                    删除
                  </button>
                </div>
              ))}
          </div>
        </div>

        {saveMutation.isSuccess ? <p className="form-success">基本信息已保存。</p> : null}
        {saveMutation.error ? <p className="form-error">{saveMutation.error.message}</p> : null}

        <button className="button" type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "保存中..." : "保存基本信息"}
        </button>
      </section>
    </div>
  );
}
