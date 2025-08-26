import { EditableCell } from "@/components/editable-cell";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { mongoClient } from "@/lib/mongodb";
import { getIronSessionData } from "@/utils/getIronSessionData";
import prettyBytes from "pretty-bytes";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ database: string; collection: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const uri = await getIronSessionData();

  if (!uri) {
    return <p>no uri</p>;
  }

  const { database: databaseName, collection: collectionName } = await params;
  const { page = "1" } = await searchParams;

  const currentPage = Math.max(1, Number.parseInt(page) || 1);
  const documentsPerPage = 20;
  const skip = (currentPage - 1) * documentsPerPage;

  const client = await mongoClient(uri);
  const db = client.db(databaseName);
  const collection = db.collection(collectionName);

  const stats = await db.command({ collStats: collectionName });

  const documents = await collection
    .find({})
    .skip(skip)
    .limit(documentsPerPage)
    .toArray();

  const totalDocuments = stats.count;
  const totalPages = Math.ceil(totalDocuments / documentsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {collectionName}
          </h1>
          <p className="text-muted-foreground text-lg">
            Database:{" "}
            <span className="font-medium text-foreground">{databaseName}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Documents
            </p>
            <p className="text-2xl font-bold text-foreground">
              {stats.count.toLocaleString()}
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Storage Size
            </p>
            <p className="text-2xl font-bold text-foreground">
              {prettyBytes(stats.storageSize)}
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Data Size
            </p>
            <p className="text-2xl font-bold text-foreground">
              {prettyBytes(stats.size)}
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Current Page
            </p>
            <p className="text-2xl font-bold text-foreground">
              {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Documents {skip + 1}-
            {Math.min(skip + documentsPerPage, totalDocuments)} of{" "}
            {totalDocuments}
          </h2>
          <div className="h-px bg-border"></div>
        </div>

        <div className="bg-card border rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  {documents[0] &&
                    Object.keys(documents[0]).map((key) => (
                      <th
                        key={key}
                        className="px-6 py-4 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {key}
                          </span>
                          {key === "_id" && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              ID
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {documents.map((doc, i) => (
                  <tr
                    key={doc._id?.toString() || i}
                    className="hover:bg-muted/30 transition-colors">
                    {Object.entries(doc).map(([key, val]) => (
                      <td
                        key={`${doc._id?.toString() || i}-${key}`}
                        className="px-6 py-4">
                        <EditableCell
                          documentId={doc._id?.toString()}
                          field={key}
                          value={
                            typeof val === "object" ? JSON.stringify(val) : val
                          }
                          databaseName={databaseName}
                          collectionName={collectionName}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="bg-card border rounded-lg p-2 shadow-sm">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={
                        currentPage > 1 ? `?page=${currentPage - 1}` : undefined
                      }
                      className={
                        currentPage <= 1
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-muted"
                      }
                    />
                  </PaginationItem>

                  {currentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          href="?page=1"
                          className="hover:bg-muted">
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {currentPage > 4 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {(() => {
                    const maxVisible = 5;
                    let start = currentPage - Math.floor(maxVisible / 2);
                    let end = currentPage + Math.floor(maxVisible / 2);

                    if (start < 1) {
                      start = 1;
                      end = Math.min(totalPages, maxVisible);
                    }
                    if (end > totalPages) {
                      end = totalPages;
                      start = Math.max(1, totalPages - maxVisible + 1);
                    }

                    const pageNumbers = Array.from(
                      { length: end - start + 1 },
                      (_, i) => start + i
                    );

                    return pageNumbers.map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href={`?page=${pageNum}`}
                          isActive={pageNum === currentPage}
                          className={
                            pageNum === currentPage
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }>
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ));
                  })()}

                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href={`?page=${totalPages}`}
                          className="hover:bg-muted">
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href={
                        currentPage < totalPages
                          ? `?page=${currentPage + 1}`
                          : undefined
                      }
                      className={
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-muted"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
