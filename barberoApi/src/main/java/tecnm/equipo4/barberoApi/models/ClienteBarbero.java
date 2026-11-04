package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "cliente_barbero")
public class ClienteBarbero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCB;

    @NotNull
    @Column(name = "estatus")
    private Boolean estatus = true;

    @ManyToOne
    @JoinColumn(name = "idCliente")
    @JsonIgnoreProperties({"foto"})
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "idBarbero")
    @JsonIgnoreProperties({"foto"})
    private Barbero barbero;
}
